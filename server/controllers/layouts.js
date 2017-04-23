const Layout = require('../models').Layout;

module.exports = {
  create(req, res) {
    return Layout
      .create({
        name: req.body.name,
        template: req.body.template
      })
      .then(layout => res.status(200).send({message: "Successfully saved layout."}))
      .catch(err => res.status(400).send(err));
  },
  retrieve(req, res) {
    return Layout
      .findById(req.params.id)
      .then(layout => {
        if(!layout) {
          return res.status(404).send({message: "Layout Not Found."})
        }
        return res.status(200).send(layout)
      })
      .catch(err => res.status(400).send(err));
  },
  list(req, res) {
    return Layout
      .all()
      .then(layouts => res.status(200).send(layouts))
      .catch(err => res.status(400).send(err));
  },
  update(req, res) {
    return Layout
      .findById(req.params.id)
      .then(layout => {
        if(!layout) {
          return res.status(404).send({message: "Layout Not Found."})
        }

        return layout
          .update({
            name: req.body.name || layout.name,
            template: req.body.template || layout.template
          })
          .then(layout => res.status(200).send(layout))
          .catch(err => res.status(400).send(err))
      })
      .catch(err => res.status(400).send(err));
  },
  delete(req, res) {
    return Layout
      .findById(req.params.id)
      .then(layout => {
        if(!layout) {
          return res.status(404).send({message: "Layout Not Found."})
        }

        return layout
          .destroy()
          .then(() => res.status(204).send({message: "Layout Successfully Deleted."}))
          .catch(err => res.status(400).send(err))
      })
      .catch(err => res.status(400).send(err));
  }
}
