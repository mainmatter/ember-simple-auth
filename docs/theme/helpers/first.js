module.exports = function(context, block) {
  return block.fn(context[0]);
};
