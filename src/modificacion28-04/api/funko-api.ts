import express from 'express';
import '../db/mongoose.js';
import { Funko } from '../models/funko.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/funkos', (req, res) => {
  const funko = new Funko(req.body);

  funko.save().then((funko) => {
    res.status(201).send(funko);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

app.get('/funkos', (req, res) => {
  const filter = req.query.id?{id: req.query.id.toString()}:{};

  Funko.find(filter).then((funkos) => {
    if (funkos.length !== 0) {
      res.send(funkos);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

app.patch('/funkos', (req, res) => {
  if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['id', 'name', 'description', 'typefunko', 'genre', 'franchise', 'num', 'exclusive', 'specs', 'value'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
        actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Funko.findOneAndUpdate({id: req.query.id}, req.body, {
        new: true,
        runValidators: true,
      }).then((funko) => {
        if (!funko) {
          res.status(404).send();
        } else {
          res.send(funko);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.delete('/funkos', (req, res) => {
  Funko.findOneAndDelete({id: req.query.id}).then((funko) => {
    if (!funko) {
      res.status(404).send();
    } else {
      res.send(funko);
    }
  }).catch(() => {
    res.status(400).send();
  });
});

app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});