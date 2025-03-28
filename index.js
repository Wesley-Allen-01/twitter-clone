const express = require('express');
const mongoose = require('mongoose');
const Post = require('./models/Posts');
const User = require('./models/Users');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const app = express();
require('dotenv').config(); // Load environment variables from .env file
const jwt = require('jsonwebtoken');
app.use(cors()); 
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});

app.use(express.json());

dummy_data = [
    {
        id: 1,
        text: "sko bufffs"
    },
    {
        id : 2,
        text: "ngl i think wes is the greateest developer of all time"
    }
]

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    }
    catch (err) {
        res.status(500).json({message: "Error fetching posts", error: err});
    }
});

app.post('/posts', async (req, res) => {
    try {
        const newPost = new Post({
            text: req.body.text,
            author: req.body.authorID
        })
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({message: "error creating post", error: err})
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    }
    catch (err) {
        res.status(500).json({message: "Error fetching users", error: err});
    }
});

app.post('/users', async (req, res) => {
    try {
        ps = req.body.password;
        username = req.body.username;
        hashed_password = await bcrypt.hash(ps, 10);
        const newUser = new User({
            username: username,
            password: hashed_password
        })
        console.log("Creating new user with username: " + username);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.log("you fucked up")
        res.status(500).json({message: "error creating user", error: err})
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({message: "Invalid username or password"});
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({message: "Invalid username or password"});
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({message: "error logging in", error: err})
    }
});

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if (token == null) {
        return res.sendStatus(401).json({ message : "User token required" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403).json({ message : "Invalid or expired token" });
        }
        req.user = user; 
        next(); 
    });
}

app.get('/me', (req, res) => {


})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

