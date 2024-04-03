const { Auth, AuthSchema } = require("../models/Auth");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const checkDuplicateEmail = async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.body.email}$`, "i");
    const auth = await Auth.findOne({ email: emailRegex });
    if (auth) {
      return res.status(409).json({ status: "error", msg: "duplicate email" });
    } else {
      return res.json({ status: "ok", msg: "email available" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error in checking email" });
  }
};

const register = async (req, res) => {
  try {
    const emailRegex = new RegExp(`^${req.body.email}$`, "i");
    const auth = await Auth.findOne({ email: emailRegex });

    if (auth) {
      return res.status(409).json({ status: "error", msg: "duplicate email" });
    }

    const hash = await bcrypt.hash(req.body.password, 12);

    const newAccount = {
      email: req.body.email,
      hash,
      role: req.body.role || "user",
    };

    if (req.body.role === "merchant") {
      newAccount.merchantDetails = {};
      if (req.body.name) newAccount.merchantDetails.name = req.body.name;
      if (req.body.address)
        newAccount.merchantDetails.address = req.body.address;
      if (req.body.area) newAccount.merchantDetails.area = req.body.area;
      if (req.body.description)
        newAccount.merchantDetails.description = req.body.description;
      if (req.body.image) newAccount.merchantDetails.image = req.body.image;
      console.log(newAccount);
    }
    await Auth.create(newAccount);

    res.json({ status: "ok", msg: "account created" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "invalid registration" });
  }
};

const login = async (req, res) => {
  try {
    const auth = await Auth.findOne({ email: req.body.email });

    if (!auth) {
      return res
        .status(400)
        .json({ status: "error", msg: "email / password invalid" });
    }

    const result = bcrypt.compare(req.body.password, auth.hash);
    if (!result) {
      console.error("email or password error");

      return res
        .status(400)
        .json({ status: "error", msg: "email / password invalid" });
    }

    const claims = {
      role: auth.accountType,
      id: auth._id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ status: "error", msg: "login failed" });
  }
};

const refresh = async (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const claims = {
      role: decoded.accountType,
      id: decoded._id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });
    console.log("refreshed access token");
    res.json({ access });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "refreshing token failed" });
  }
};

const getEnum = async (req, res) => {
  try {
    const areas = await AuthSchema.path("merchantDetails.area").enumValues;
    const accountTypes = await AuthSchema.path("accountType").enumValues;

    res.json({ areas, accountTypes });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "fail to get enum" });
  }
};

module.exports = { checkDuplicateEmail, register, login, refresh, getEnum };
