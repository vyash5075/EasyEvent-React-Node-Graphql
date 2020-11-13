const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {                            //user can create more than one event 
      type: Schema.Types.ObjectId,
      ref: 'Event'      //ref field is important internally for mongoose because this allows to setup a relation and let mongoose know 
                    //that two models are related which will later help in fetch data.
                    //Event = name of another model .
                        // now we tell mongoose that we store  object ids  in  createdevents and that object ids are from event model
    }
  ]
});

module.exports = mongoose.model('User', userSchema);