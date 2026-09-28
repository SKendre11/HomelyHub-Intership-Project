import { Property } from "../Models/propertyModel.js";

export const generateTripPlan = async (req, res) => {
  try {
    const { destination, budget, days, people, interests = [] } = req.body;

    if (!destination || !budget || !days || !people) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide destination, budget, days, and number of people",
      });
    }

    const numDays = Math.max(1, parseInt(days, 10) || 1);
    const numBudget = Math.max(1, parseFloat(budget) || 10000);
    const perNight = Math.round(numBudget / numDays);

    // Fetch properties from MongoDB matching city/state or fallback to available stays within budget
    const regex = new RegExp(destination.trim(), "i");
    let properties = await Property.find({
      $or: [
        { "address.city": regex },
        { "address.state": regex },
        { propertyName: regex },
      ],
      price: { $lte: perNight * 2 },
    })
      .limit(6)
      .lean();

    // Fallback if no direct location match
    if (!properties || properties.length === 0) {
      properties = await Property.find({ price: { $lte: perNight * 2 } })
        .sort({ rating: -1 })
        .limit(6)
        .lean();
    }

    if (!properties || properties.length === 0) {
      properties = await Property.find({})
        .sort({ rating: -1 })
        .limit(6)
        .lean();
    }

    // Try AI generation if GEMINI_API_KEY or OPENAI_API_KEY is available
    let plan = null;
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    if (process.env.GEMINI_API_KEY) {
      try {
        const promptText = `You are a professional luxury travel planner for HomelyHub. Create a personalized ${numDays}-day itinerary for ${people} people visiting ${destination} with a total budget of Rs ${numBudget} (${perNight} Rs/night for stay). Their interests include: ${interests.join(", ") || "sightseeing, local food"}.
        Respond ONLY with a valid JSON object matching this exact structure:
        {
          "summary": "A 1-2 sentence overview of the trip experience",
          "days": [
            {
              "day": 1,
              "title": "Short Day Title",
              "activities": ["Activity 1 description", "Activity 2 description", "Activity 3 description"]
            }
          ],
          "tips": ["Useful local travel tip 1", "Useful local travel tip 2"]
        }`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );

        if (response.ok) {
          const aiRes = await response.json();
          const text = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            plan = JSON.parse(text);
          }
        }
      } catch (aiErr) {
        console.warn("Gemini API call warning:", aiErr.message);
      }
    }

    // Intelligent tailored itinerary generator if no API key or AI call fails
    if (!plan || !plan.days || !Array.isArray(plan.days)) {
      const interestList = interests.length > 0 ? interests : ["Sightseeing", "Food", "Relaxation"];
      const generatedDays = [];

      for (let i = 1; i <= numDays; i++) {
        const theme = interestList[(i - 1) % interestList.length];
        generatedDays.push({
          day: i,
          title: `Day ${i}: ${destination} ${theme} & Exploration`,
          activities: [
            `Start your morning with local breakfast specialties near your stay in ${destination}`,
            `Explore iconic ${theme.toLowerCase()} attractions and popular landmarks around ${destination}`,
            `Enjoy evening dinner and sunset views at top-rated local restaurants`,
          ],
        });
      }

      plan = {
        summary: `Experience an unforgettable ${numDays}-day getaway in ${destination} tailored for ${people} travelers with a focus on ${interestList.join(", ")}.`,
        days: generatedDays,
        tips: [
          `Book your stay early during peak seasons in ${destination}.`,
          `Keep local transport apps and cash ready for seamless travel.`,
          `Check local weather reports before outdoor activities.`,
        ],
      };
    }

    return res.status(200).json({
      status: "success",
      data: {
        plan,
        perNight,
        properties,
      },
    });
  } catch (error) {
    console.error("Error in generateTripPlan:", error);
    return res.status(500).json({
      status: "error",
      message: "Could not create a trip plan, please try again",
    });
  }
};

export const generateDescription = async (req, res) => {
  try {
    const { propertyName, propertyType, city, extraInfo } = req.body;
    
    let description = `Welcome to ${propertyName || "our stay"}, a beautiful ${propertyType || "property"} located in ${city || "a prime location"}. Offering modern comfort, serene surroundings, and premium hospitality for an unforgettable stay.`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const promptText = `Write an attractive property description for a stay named "${propertyName}" of type "${propertyType}" in "${city}". Additional details: ${extraInfo || ""}.`;
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
            }),
          }
        );
        if (response.ok) {
          const aiRes = await response.json();
          const text = aiRes.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) description = text.trim();
        }
      } catch (err) {
        console.warn("Gemini description error:", err);
      }
    }

    return res.status(200).json({
      status: "success",
      data: {
        description,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Failed to generate property description",
    });
  }
};
