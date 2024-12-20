exports.getAllModels= async(model, populatedKeys = undefined, selectedKeys = undefined ) => {
    let modelToBeRetrieved= await model.find().populate(populatedKeys ?? undefined).select(selectedKeys ?? undefined);
    return modelToBeRetrieved;
  }
  exports.getModelById= async(model, id, populatedKeys = undefined, selectedKeys = undefined ) => {
    let modelToBeFetched=await model.findById(id).populate(populatedKeys ?? undefined).select(selectedKeys ?? undefined).lean();
    return modelToBeFetched;
  }
  exports.findOne= async (model, query, populatedKeys = undefined ) => {
    let modelToBeRetrieved = await model.findOne(query).populate(populatedKeys ?? undefined);
    return modelToBeRetrieved;
  }
  exports.createModel = async (model, inputs, helper ) => {
    let modelToBeCreated = new model(inputs);
    await modelToBeCreated.save();
    return modelToBeCreated;
  }
  exports.deleteModelById= async (model, id ) => {
    let modelToBeDeleted=await model.findByIdAndDelete(id);
    return modelToBeDeleted;
  }
  exports.updateModelById = async (model, id, inputs ) => {
    let modelToBeUpdated = await model.findByIdAndUpdate(id,{...inputs},{new:true});
    if (modelToBeUpdated) return modelToBeUpdated;
    else if (!modelToBeUpdated) return null;
  }