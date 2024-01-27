const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const mongoUrl = "mongodb+srv://gelila:admin1@cluster0.ycizi1w.mongodb.net/?retryWrites=true&w=majority"

const JWT_SECRET="5e56f1e5d4a8d7c2baf8a3e7b95a1f8d[]nhjjdk";

mongoose.connect(mongoUrl).then(()=>{
  console.log("Database connected");
})
.catch((e)=> {
  console.log(e);
})


require('./userData')
const user=mongoose.model("UserInfo");


app.get("/", (req,res)=>{
res.send({status:"Started"})
})

app.post('/signup',async(req,res)=>{
  const {name, email , password} = req.body;

  const userExist= await user.findOne({email:email});
    if (userExist){
    return res.send({ data: "user already Exist"});
  }
const encryptedPass = await bcrypt.hash(password, 10);
  try {
    await user.create({
      name:name,
      email,
      password: encryptedPass,
    })
    res.send({status:"ok", data:"user Created"});
  } catch (error) {
    res.send({status:"error", data: error});

  }
});


app.post("/login",async(req,res)=>{
  const {email, password}= req.body;
  const userExist= await user.findOne({email:email});
  if (!userExist){
  return res.send({ data: "user doesn't Exist"});
} 
if (await bcrypt.compare(password,userExist.password)){
const token = jwt.sign({ email:userExist.email },JWT_SECRET);
if (res.status(201)){
  return res.send({ status: "ok", data:token});

}else{
  return res.send({error});
}
}

})
app.post("/add-favorite", async (req, res) => {
  const { email, song } = req.body;

  try {
    const updatedUser = await user.findOneAndUpdate(
      { email: email },
      { $addToSet: { favoriteSongs: song } },
      { new: true }
    );

    res.send({ status: "ok", data: updatedUser.favoriteSongs });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});
app.get("/get-favorites", async (req, res) => {
  const { email } = req.query;

  try {
    const userWithFavorites = await user.findOne({ email: email });
    if (!userWithFavorites) {
      return res.send({ status: "error", data: "User not found" });
    }

    res.send({ status: "ok", data: userWithFavorites.favoriteSongs });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});


const Playlist = require('./playlistInfo');




app.post('/api/createPlaylist', async (req, res) => {
  try {
    console.log('Request received at /api/createPlaylist');
    const { newPlaylistName, selectedSongs } = req.body;

    if (newPlaylistName.trim() !== '') {
      
      const Playlist = mongoose.model("Playlist");

     
      const result = await Playlist.findOneAndUpdate(
        {},
        { $inc: { id: 1 } },
        { sort: { id: -1 }, upsert: true, new: true }
      );

      const newId = result.id;

    
      const newPlaylist = new Playlist({
        id: newId,
        name: newPlaylistName.trim(),
        songs: selectedSongs,
      });

      
      await newPlaylist.save();

      res.status(201).json({ message: 'Playlist created successfully' });
    } else {
      res.status(400).json({ message: 'Invalid playlist name' });
    }

    console.log('Request processed successfully');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/api/getPlaylists", async (req, res) => {
  try {
   
    const playlists = await Playlist.find();
    
   
    res.status(200).json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(5001, () => {
    console.log("Node js server started!!!!");
  });