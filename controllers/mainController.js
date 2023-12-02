const adminLayout = '../views/layouts/admin' // directory to be used for admin layout

const Post = require('../models/post')

exports.getIndex = async(req, res, next) => {

    try {

        let locals = {
            title: "Blog Website",
            description: " blog website built using node.js express and mongoDb"
        }

        // pagination
        const perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage).limit(perPage).exec();


        const count = await Post.find({ userId: null }).countDocuments();

        const nextPage = parseInt(page) + 1;

        const hasnextPage = nextPage <= Math.ceil(count / perPage);


        res.render('index', {
            locals,
            data,
            currentPage: page,
            nextPage: hasnextPage ? nextPage : null

        })

    } catch (error) {
        console.log(error);
    }

}


exports.getAbout = (req, res, next) => {

    let locals = {
        title: "About",
        description: " blog website built using node.js express and mongoDb"
    }


    res.render('about', { locals, layout: adminLayout });
}


exports.getContact = (req, res, next) => {

    let locals = {
        title: "Contact",
        description: " blog website built using node.js express and mongoDb"
    }
    res.render('contact', { locals, layout: adminLayout });
}


exports.getPost = async(req, res, next) => {

    try {
        const postId = req.params.postId;

        const post = await Post.findById({ _id: postId });

        let locals = {
            title: post.title,
            description: " blog website built using node.js express and mongoDb"
        }

        res.render('post', {
            post,
            locals,
            layout: adminLayout

        })

    } catch (error) {
        console.log(error);
    }

}

exports.postSearch = async(req, res, next) => {

    try {

        let locals = {
            title: "Search",
            description: " blog website built using node.js express and mongoDb"
        }

        const searchTerm = req.body.searchTerm;

        const noSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(noSpecialChars, 'i') } },
                { body: { $regex: new RegExp(noSpecialChars, 'i') } }

            ]
        })


        res.render('search', { locals, data })

    } catch (error) {

        console.log(error)

    }

}

exports.getDashboard = async(req, res, next) => {

    try {

        let locals = {
            title: "DashBoard",
            description: " blog website built using node.js express and mongoDb"
        }

        const data = await Post.find({ userId: req.session.user._id });

        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {

        console.log(error)

    }


}

exports.getAddPost = (req, res, next) => {

    try {

        let locals = {
            title: "Add Post",
            description: " blog website built using node.js express and mongoDb"
        }

        res.render('admin/add-post', { locals, layout: adminLayout })


    } catch (error) {
        console.log(error)
    }

}

exports.postAddPost = async(req, res, next) => {

    try {

        const title = req.body.title;
        const body = req.body.body;

        const newPost = new Post({
            title: title,
            body: body,
            userId: req.session.user._id
        })

        try {
            const addPost = await Post.create(newPost);

            res.redirect('/dashboard')

        } catch (error) {
            console.log(error)
        }

    } catch (error) {

        console.log(error)
    }


}


exports.getEditPost = async(req, res, next) => {

    try {

        let locals = {
            title: "Edit Post",
            description: " blog website built using node.js express and mongoDb"
        }

        const postId = req.params.postId;

        try {
            const post = await Post.findById(postId);

            res.render('admin/edit-post', { post, locals, layout: adminLayout })
        } catch (error) {
            console.log(error)
        }

    } catch (error) {
        console.log(error)
    }

}

exports.putEditPost = async(req, res, next) => {

    try {
        const postId = req.params.postId;

        const updatedtitle = req.body.title;
        const updatedbody = req.body.body;

        try {
            const post = await Post.findByIdAndUpdate(postId, {
                title: updatedtitle,
                body: updatedbody,

            });

            res.redirect('/dashboard')
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }


}

exports.deletePost = async(req, res, next) => {

    try {
        const postId = req.params.postId;

        await Post.deleteOne({ _id: postId });

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error)
    }

}