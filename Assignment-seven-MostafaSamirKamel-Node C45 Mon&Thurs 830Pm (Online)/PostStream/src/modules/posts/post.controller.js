const { Post, User, Comment } = require('../../models/index');
const { Sequelize } = require('sequelize');

const createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const post = new Post({ title, content, userId });
        await post.save();
        res.status(201).json({ message: "Post created successfully." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body; // Assuming userId is passed to verify ownership

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found." });
        }

        if (post.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post." });
        }

        await post.destroy();
        res.status(200).json({ message: "Post deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPostDetails = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'title'],
            include: [
                {
                    model: User,
                    attributes: ['name']
                },
                {
                    model: Comment,
                    attributes: ['id', 'content']
                }
            ]
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPostsCommentCount = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: [
                'id',
                'title',
                [Sequelize.fn('COUNT', Sequelize.col('Comments.id')), 'commentCount']
            ],
            include: [{
                model: Comment,
                attributes: []
            }],
            group: ['Post.id']
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    deletePost,
    getPostDetails,
    getPostsCommentCount
};
