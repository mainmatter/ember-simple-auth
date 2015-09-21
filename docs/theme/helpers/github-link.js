/*global self:true */
module.exports = {
  githubLink: function(context, githubUrl, projectVersion, file, line) {
    console.log(context.githubUrl);
    return githubUrl + '/blob/' + projectVersion + '/' + file + '#L' + line;
  }
};
