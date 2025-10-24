import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUser = async (request, response, next) => {
  const { username, password } = request.body;

  // use bcrypt to hash our password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create a user object in our db with the hashed pw
  const user = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  // respond with the created user
  response.status(201).json(user);
};

export const userLogin = async (request, response) => {
  const { username, password } = request.body;

  // get our user from the db
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  // if the user doesn't exist, send a 401 error response
  if (!user) {
    return response.status(401).json({ error: "Username does not exist" });
  }

  // check if plain text password matches the hashed pw in db
  const validPassword = await bcrypt.compare(password, user.password);

  // if password is incorrect, send a 401 error response
  if (!validPassword) {
    return response.status(401).json({ error: "Wrong password, buddy" });
  }

  // if all is good, create our JWT
  const token = jwt.sign(
    {
      userId: user.id,
      role: "regular", // we'll use the role later when we implement that feature
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // respond with the JWT
  response.json({ token, username, id: user.id });
};
