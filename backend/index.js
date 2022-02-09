const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()
const PORT = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
		optionSuccessStatus: 200,
	}),
);

// app.use(cors({ origin: "http://localhost:3003", credentials: true }));

app.enable("trust proxy")

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection
connection.once("open",() => console.log(`MongoDB connected`))

const authRouter = require('./model/router/auth')
app.use('/auth', authRouter)



app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
})