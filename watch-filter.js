module.exports = function(f){
  const res = f.search(/(\.(pug|jade)$|[\\/][^\\/.]+$)/)>=0
  return res ? true : false
}