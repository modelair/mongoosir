const mongoose = require('mongoose')
const modelair = require('modelair')

const ObjectID = mongoose.Schema.Types.ObjectId
const modelToSchema = (model) => new mongoose.Schema(modifyCopyModel(model))
const Buffer = mongoose.Schema.Types.Buffer
const __Buffer = 'mongoose-buffer'
const __ObjectID = 'mongoose-id'

/// CHECKS OBJECTID FOR MONGOOSE
const modifyCopyModel = function (_model) {
  let model = modelair.clone(_model)
  for (let item in model) {
    if (!item) return {}
    if (typeof model[item] === 'object') {
      if (model[item] instanceof RegExp) {
        continue
      }
      if (model[item] instanceof Array) {
        if (model[item][0] === __ObjectID) {
          model[item] = [ObjectID]
          continue
        }
        if (typeof model[item][0] === 'object') {
          model[item] = [modifyCopyModel(model[item][0])]
          continue
        }
      }
      if ('type' in model[item]) {
        if (model[item].type === __ObjectID) {
          model[item].type = ObjectID
        }
        if (model[item].type === __Buffer) {
          model[item].type = Buffer
        }
      } else {
        model[item] = modifyCopyModel(model[item])
      }
    } else {
      if (model[item] === __ObjectID) {
        model[item] = ObjectID
      }
      if (model[item] === __Buffer) {
        model[item] = Buffer
      }
      // if (model[item] === __Buffer) {
      //   model[item] = Buffer
      // }
    }
  }
  return model
}
const copyModelResult = object => Object.assign({}, object._doc)
const clearSecureFields = (modelData) => {
  delete modelData.password
  // modelData._id = null
  delete modelData.__v
  // delete modelData.history !todo
  return modelData
}
const clearSpecials = function (modelData) {
  for (let item in modelData) {
    if (item[0] === '$') {
      delete modelData[item]
    }
  }
}
const clearSystemFields = function (modelData) {
  if ('__v' in modelData) delete modelData.__v
  return modelData
}
const clearMongoFields = model => clear(['_id', '__v'], model)
const clear = (fields, model) => {
  fields.forEach(field => {
    delete model[field]
  })
  return model
}

const isValidObjectId = objectId => typeof objectId === 'string' && objectId.length === 24 && /^[a-f0-9]+$/i.test(objectId)
const asObjectId = value => mongoose.Types.ObjectId(value)
const compareIds = (is, equal) => is.toString() === equal.toString()
export default {
  asObjectId,
  clearMongoFields,
  clearSpecials,
  clearSystemFields,
  clearSecureFields,
  compareIds,
  modifyCopyModel,
  modelToSchema,
  copyModelResult,
  ObjectID,
  isValidObjectId
}
