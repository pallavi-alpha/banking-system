import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { InterestRule } from "../models/interestRule.models.js";

export const getInterestRules = asyncHandler(async (req, res) => {
  try {
    // Fetch all interest rules from the database sorted by date (ascending)
    const interestRules = await InterestRule.find().sort({ date: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          interestRules,
          "Interest rules fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const addInterestRule = asyncHandler(async (req, res) => {
  try {
    const { date, ruleId, rate } = req.body;

    if (!date || !ruleId || !rate) {
      throw new ApiError(400, "Please enter all the fields");
    }

    // Check if an interest rule already exists for the given date
    const existingRule = await InterestRule.findOne({
      date: date,
    });

    if (existingRule) {
      // If an existing rule is found, update it with the new rate
      existingRule.ruleId = ruleId;
      existingRule.rate = rate;
      await existingRule.save();
    } else {
      // If no rule exists, create a new interest rule
      const newInterestRule = new InterestRule({
        date,
        ruleId,
        rate,
      });
      await newInterestRule.save();
    }

    // Fetch all interest rules and sort by date
    const interestRules = await InterestRule.find().sort({ date: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          interestRules,
          "Interest rule added successfully and all rules fetched."
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
