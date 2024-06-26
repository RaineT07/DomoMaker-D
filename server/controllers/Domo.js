const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => {
  return res.render('app');
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.experience) {
    return res.status(400).json({ error: 'Name, age, and experience are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    experience: req.body.experience,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({name: newDomo.name, age:newDomo.age, experience: newDomo.experience});
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req,res) =>{
  try{
    const query = {owner: req.session.account._id};
    const docs = await Domo.find(query).select('name age experience').lean().exec();

    return res.json({domos:docs});
  }catch (err){
    console.log(err);
    return res.status(500).json({error:"Error retrieving domos!"});
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
};
