const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');

// User - Post Association
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Post - Comment Association
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

// User - Comment Association
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Post,
    Comment
};
