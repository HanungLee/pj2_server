/*module.exports = function(app)
{
	app.get('/', function(req,res){
		res.send('hello')});
	app.get('/about', function(req,res){
		res.send('hihi')});
}
*/
var mongoose = require('mongoose');
module.exports = function(app, Book, User, Post, Honor)
{
    // GET ALL BOOKS
    app.get('/api/books', function(req,res){
		Book.find(function(err, books){
			if(err) return res.status(500).send({error: 'database failure'});
			res.json(books);
		})
		//res.send('jojo')
	});

    // GET SINGLE BOOK
    app.get('/api/books/:book_id', function(req, res){
        res.end();
    });

    // GET BOOK BY AUTHOR
    app.get('/api/books/author/:author', function(req, res){
        Book.find({author: req.params.author},  function(err, books){
            if(err) return res.status(500).json({error: err});
            if(books.length === 0) return res.status(404).json({error: 'book not found'});
            res.json(books);
        })
    });	

    // CREATE BOOK
    app.post('/api/books', function(req, res){
        var book = new Book();
        book.title = req.body.title;
        book.author = req.body.author;
        //book.published_date = new Date(req.body.published_date);
    
        book.save(function(err){
            if(err){
                console.error(err);
                res.send({result: 0});
                return;
            }
			else  {
				console.log(req.body.title);
				console.log(req.body.name);
				res.send({result: 1});
			}
    
        });

    });

    // UPDATE THE BOOK
    app.put('/api/books/:book_id', function(req, res){
        res.end();
    });

    // DELETE BOOK
    app.delete('/api/books/:book_id', function(req, res){
        res.end();
    });




    /*****************************************************/
    /*****************************************************/
    /*****************************************************/
    /*****************************************************/


    
    //POST : login
    app.post('/api/login', function(req, res){
        console.log("hihi")
        User.find({email: req.body.email}, function(err, users){
            console.log("hihi1111")

            if(err) return res.status(500).json({error: err});
            if(users.length == 0) {
                console.log("hihi2")

                var new_user = new User();
                new_user.email = req.body.email;
                new_user.name = req.body.name;
                new_user.save(function(error){
                    console.log("hihi3")

                    if(error){
                        console.error(error);
                        res.send({result: 0});
                        return;
                    }
                    else  {
                        res.json({new_user});
                        return;
                    }
            
                });
            }
            else {
                console.log("already created");
                res.json({users});
            }
        })
    });

    //get my like posts
    app.get('/api/posts/like/:user', function(req, res){
        User.findOne({email: req.params.user},  function(err, users){
            if(err) return res.status(500).json({error: err});
            if(!users) return res.status(404).json({error: 'posts not found'});
            res.json(users.post_like)
            //like_info array를 그대로 return
        })
    });

    //put : press like button
    app.put('/api/press_like', function(req, res){
        console.log(req.body.email)
        console.log(req.body.post_id)
        console.log(mongoose.Types.ObjectId(req.body.post_id))

        User.findOne({email:req.body.email}, function(err, user1){
         
            let post_like_user1 = user1.post_like;
    
            console.log(post_like_user1)
              
            if(post_like_user1 == null){
                console.log("I'm here 1")
    
                post_like_user1.push({post_id: req.body.post_id, number:1});
            }
            else{
                var i;
                console.log("I'm here 2")
    
                for(i = 0; i < post_like_user1.length; i++){
                    //if(post_like_user1.post_id == req.body.post_id){
                    console.log("for loop")
                    console.log(post_like_user1[i].post_id)
                    console.log(req.body.post_id)
    
    
                    if(mongoose.Types.ObjectId(req.body.post_id).equals(post_like_user1[i].post_id)){
                        console.log("I'm here 3")
    
                        post_like_user1[i].number += 1;
                        break;
                    }
                }
                if(i == post_like_user1.length){
                    console.log("I'm here 4")
                    post_like_user1.push({post_id: req.body.post_id, number:1});
                }
            }
    
            user1.save(function(err2){
                if(err2) return res.json({error: err2});
                //return res.json({user1})
            })
    
    
          });
    
          Post.findById(req.body.post_id, function(err, post1){
            if(err) return res.status(500).json({ error: 'database failure' });
            if(!post1) return res.status(404).json({ error: 'post not found' });
    
            post1.like_count++;    
    
            let like_info_user = post1.liked.find(function(element){
                return element.user_id == req.body.email
            })
    
            if(typeof like_info_user == 'undefined'){
                console.log("I'm here 5")
    
                post1.liked.push({user_id: req.body.email, number: 1})
            }else{
                console.log("I'm here 6")
    
                like_info_user.number += 1;
            }
    
    
            post1.save(function(error){
                if(error) return res.status(500).json({error: 'failed to update'});
                res.json(post1);
            });
    
        });
    
    
    });
      

    //get someone's post    ?? post에서 찾지 말고 user에서 찾은것들로.
    app.get('/api/posts/user/:user', function(req, res){
        Post.find({writer: req.params.user},  function(err, posts){
            if(err) return res.status(500).json({error: err});
            if(!posts) return res.status(404).json({error: 'posts not found'});
            res.json(posts);
        })
    });

    //console.log(new Date(recent_honor.date.setTime(recent_honor.date.getTime()+5*60*1000)))

    //get all posts (plus user like information)
    app.get('/api/posts/all/:user', function(req, res){

        var date = new Date();
        console.log(date);
        var date_now = new Date(date.setTime(date.getTime()+9*60*60*1000));
        console.log(date_now);

        var date2 = Math.floor(date_now.getMinutes()/5)*5;
        date_now.setMinutes(date2);
        
        Post.find({date : {$gte: new Date(date_now)}}, null, {sort: {like_count: -1}},  function(err, posts){
            if(err) return res.status(500).json({error: err});
            if(!posts) return res.status(404).json({error: 'posts not found'});
            //res.json(posts);


            User.findOne({email : req.params.user}, {post_like: 1}, function(err2, user){
                if(err2) return res.status(500).json({error: err});
                if(!user) return res.status(404).json({error: 'user not found'});

                var obj = {allpost: posts, userpost: user};
                res.json(obj);

            })

        })      
        
    });

    //for 5 minutes
    app.get('/api/posts/honor', function(req, res){
        console.log("hihi");

        Honor.find().sort({date:-1}).limit(1).exec(function(err, honors){
            if(err) return res.status(500).json({error: err});
            
            if(honors.length == 0){
                console.log("im here length 0")

                Post.find({like_count : {$gte:1}}, null, {sort: {date: 1}}, function(err2, posts){
                    var i;
                    var date_iter, date_last;
                    var new_honor;
                    console.log(posts)
                    if(!posts) {
                        Honor.find({}, null, {sort: {date: -1}}, function(err4, honors11){
                        return res.json(honors11);
                    })}

                    for(i = 0; i < posts.length; i++){

                        date_iter = new Date(posts[i].date);                        
                        var time_now_minutes_floor = Math.floor(date_iter.getMinutes()/5)*5; //5 minutes!!!
                        date_iter.setMinutes(time_now_minutes_floor);
                        console.log("im here length 01")

                        if(i == 0){
                            date_last = date_iter;
                            new_honor = posts[i];
                            console.log("im here length 02")
                            if(i == posts.length){
                                var add_honor = new Honor();
                                add_honor.writer = new_honor.writer;
                                add_honor.content = new_honor.content;
                                add_honor.photo = new_honor.photo;
                                add_honor.liked = new_honor.liked.sort(function(a, b){
                                    return b.number - a.number;
                                }).slice(0, 2);
                                add_honor.like_count = new_honor.like_count;
                                
                                var date1 = new_honor.date;
                                var date2 = Math.floor(date1.getMinutes()/5)*5;
                                date1.setMinutes(date2);
                                add_honor.date = date1;
                                
                                add_honor.save(function(err3){
                                    if(err3) return res.status(500).json({error: 'failed to upload honor'});
                                });
                            }

                        }
                        if(date_iter - date_last > new Date('0000-00-00T00:05:00')){
                            console.log("im here length 03")

                            var add_honor = new Honor();
                            add_honor.writer = new_honor.writer;
                            add_honor.content = new_honor.content;
                            add_honor.photo = new_honor.photo;
                            add_honor.liked = new_honor.liked.sort(function(a, b){
                                return b.number - a.number;
                            }).slice(0, 2);
                            add_honor.like_count = new_honor.like_count;
                            
                            var date1 = new_honor.date;
                            var date2 = Math.floor(date1.getMinutes()/5)*5;
                            date1.setMinutes(date2);
                            add_honor.date = date1;



                            add_honor.save(function(err3){
                                if(err3) return res.status(500).json({error: 'failed to upload honor'});
                            });

                            date_last = date_iter;
                            new_honor = posts[i];

                            if(i == posts.length-1){
                                var add_honor = new Honor();
                                add_honor.writer = new_honor.writer;
                                add_honor.content = new_honor.content;
                                add_honor.photo = new_honor.photo;
                                add_honor.liked = new_honor.liked.sort(function(a, b){
                                    return b.number - a.number;
                                }).slice(0, 2);
                                add_honor.like_count = new_honor.like_count;
                                
                                var date1 = new_honor.date;
                                var date2 = Math.floor(date1.getMinutes()/5)*5;
                                date1.setMinutes(date2);
                                add_honor.date = date1;
                                
                                add_honor.save(function(err3){
                                    if(err3) return res.status(500).json({error: 'failed to upload honor'});
                                });
                            }

                        }else{
                            if(new_honor.like_count <= posts[i].like_count)
                                new_honor = posts[i];

                            console.log("im HERE00000")
   
                            if(i == posts.length-1){
                                console.log("im herellllll")
                                var add_honor = new Honor();
                                add_honor.writer = new_honor.writer;
                                add_honor.content = new_honor.content;
                                add_honor.photo = new_honor.photo;
                                add_honor.liked = new_honor.liked.sort(function(a, b){
                                    return b.number - a.number;
                                }).slice(0, 2);
                                add_honor.like_count = new_honor.like_count;
                               
                                var date1 = new_honor.date;
                                var date2 = Math.floor(date1.getMinutes()/5)*5;
                                date1.setMinutes(date2);
                                add_honor.date = date1;
                                
                                add_honor.save(function(err3){
                                    if(err3) return res.status(500).json({error: 'failed to upload honor'});
                                });
                            }
                        }
                    }

                    



                })
            
            }else{
                let recent_honor = honors[0];
                console.log(new Date(recent_honor.date.setTime(recent_honor.date.getTime()+5*60*1000)))
                Post.find({date : {$gte: new Date(recent_honor.date)}, like_count : {$gte : 1}}, null, {sort: {date: 1}}, 
            


                function(err2, posts){
                    var i;
                    var date_iter, date_last;
                    var new_honor;
                    console.log(posts)
                    if(!posts) {
                        Honor.find({}, null, {sort: {date: -1}}, function(err4, honors11){
                            return res.json(honors11);
                        })
                    } 
                    
                    for(i = 0; i < posts.length; i++){

                        date_iter = new Date(posts[i].date);                        
                        var time_now_minutes_floor = Math.floor(date_iter.getMinutes()/5)*5; //5 minutes!!!
                        date_iter.setMinutes(time_now_minutes_floor);
                        console.log("im here length 01")

                        console.log(posts[i])
                        console.log(recent_honor)
                        if(date_iter == recent_honor.date){ 
                            if(posts[i].like_count >= recent_honor.like_count){
                            console.log("change recent")
                            recent_honor.writer = posts[i].writer
                            recent_honor.content = posts[i].content 
                            recent_honor.photo = posts[i].photo
                            recent_honor.liked = posts[i].liked
                            recent_honor.like_count = posts[i].like_count
                            recent_honor.save();
                            }
                            else continue;
                        }
                        if(i == 0){
                            date_last = date_iter;
                            new_honor = posts[i];
                            console.log("im here length 02")
                            if(i == posts.length){
                                var add_honor = new Honor();
                                add_honor.writer = new_honor.writer;
                                add_honor.content = new_honor.content;
                                add_honor.photo = new_honor.photo;
                                add_honor.liked = new_honor.liked.sort(function(a, b){
                                    return b.number - a.number;
                                }).slice(0, 2);
                                add_honor.like_count = new_honor.like_count;
                                
                                var date1 = new_honor.date;
                                var date2 = Math.floor(date1.getMinutes()/5)*5;
                                date1.setMinutes(date2);
                                add_honor.date = date1;
                                
                                add_honor.save(function(err3){
                                    if(err3) return res.status(500).json({error: 'failed to upload honor'});
                                });
                            }

                        }
                        if(date_iter - date_last >= new Date('0000-00-00T00:05:00')){
                            console.log("im here length 03")

                            var add_honor = new Honor();
                            add_honor.writer = new_honor.writer;
                            add_honor.content = new_honor.content;
                            add_honor.photo = new_honor.photo;
                            add_honor.liked = new_honor.liked.sort(function(a, b){
                                return b.number - a.number;
                            }).slice(0, 2);
                            add_honor.like_count = new_honor.like_count;
                            
                            var date1 = new_honor.date;
                            var date2 = Math.floor(date1.getMinutes()/5)*5;
                            date1.setMinutes(date2);
                            add_honor.date = date1;
                            
                            add_honor.save(function(err3){
                                if(err3) return res.status(500).json({error: 'failed to upload honor'});
                            });

                            date_last = date_iter;
                            new_honor = posts[i];

                            if(i == posts.length-1){
                                var add_honor = new Honor();
                                add_honor.writer = new_honor.writer;
                                add_honor.content = new_honor.content;
                                add_honor.photo = new_honor.photo;
                                add_honor.liked = new_honor.liked.sort(function(a, b){
                                    return b.number - a.number;
                                }).slice(0, 2);
                                add_honor.like_count = new_honor.like_count;
                                
                                var date1 = new_honor.date;
                                var date2 = Math.floor(date1.getMinutes()/5)*5;
                                date1.setMinutes(time_now_minutes_floor);
                                add_honor.date = date1;
                                
                                add_honor.save(function(err3){
                                    if(err3) return res.status(500).json({error: 'failed to upload honor'});
                                });
                            }

                        }else{
                            if(new_honor.like_count <= posts[i].like_count)
                                new_honor = posts[i];

                            console.log("im HERE00000")
   
                            if(i == posts.length-1){
                                console.log("im herellllll")
                                var add_honor = new Honor();
                                add_honor.writer = new_honor.writer;
                                add_honor.content = new_honor.content;
                                add_honor.photo = new_honor.photo;
                                add_honor.liked = new_honor.liked.sort(function(a, b){
                                    return b.number - a.number;
                                }).slice(0, 2);
                                add_honor.like_count = new_honor.like_count;
                                
                                var date1 = new_honor.date;
                                var date2 = Math.floor(date1.getMinutes()/5)*5;
                                date1.setMinutes(time_now_minutes_floor);
                                add_honor.date = date1;
                                
                                add_honor.save(function(err3){
                                    if(err3) return res.status(500).json({error: 'failed to upload honor'});
                                });
                            }
                        }
                    }
            
            })
            }

        })

        Honor.find({}, null, {sort: {date: -1}}, function(err4, honors11){
            res.json(honors11);
        })

    });



    // CREATE POST
    app.post('/api/posts', function(req, res){
		var post = new Post();
		post.writer = req.body.writer;         
        post.content = req.body.content;
        post.date = req.body.date;

        if(req.body.photo != null)
            post.photo = req.body.photo;
        
        post.save(function(err, newpost){
            if(err){
                console.error(err);
                res.send({result: 0});
                return;
            }
			else  {
                User.update({email:req.body.writer}, {$push: {post: newpost.id}}, 
                  function (error, success) {
                    if (error) {
                        console.log(error);

                    } else {
                        console.log(success);

                    }
                    });
				res.send({result: 1});
			}
    
        });



    });

    //press like button






    //get all posts

    //get someone's posts

    //put post

    //update like

    //update comment

}



