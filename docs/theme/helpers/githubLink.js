module.exports = function(options) {
  return [options.data.root.project.githubUrl, '/blob/master/', this.file, '#L', this.line].join('');
}
