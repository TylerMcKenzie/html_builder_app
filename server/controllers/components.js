const Component = require('../models').Component;

module.exports = {
  create(req, res) {
    return Component
      .create({
        name: req.body.name,
        template: req.body.template
      })
      .then(component => res.status(200).send({message: "Successfully saved component."}))
      .catch(err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return Component
      .findById(req.params.id)
      .then(component => {
        if(!component) {
          return res.status(404).send({message: "Component Not Found."})
        }
        return res.status(200).send(component)
      })
      .catch(err => res.status(400).send(err));
  },
  list(req, res) {
    return Component
      .all()
      .then(components => res.status(200).send(components))
      .catch(err => res.status(400).send(err));
  },
  update(req, res) {
    return Component
      .findById(req.params.id)
      .then(component => {
        if(!component) {
          return res.status(404).send({message: "Component Not Found."})
        }

        return component
          .update({
            name: req.body.name || component.name,
            template: req.body.template || component.template
          })
          .then(component => res.status(200).send(component))
          .catch(err => res.status(400).send(err))
      })
      .catch(err => res.status(400).send(err));
  },
  delete(req, res) {
    return Component
      .findById(req.params.id)
      .then(component => {
        if(!component) {
          return res.status(404).send({message: "Component Not Found."})
        }

        return component
          .destroy()
          .then(() => res.status(204).send({message: "Component Successfully Deleted."}))
          .catch(err => res.status(400).send(err))
      })
      .catch(err => res.status(400).send(err));
  }
}
