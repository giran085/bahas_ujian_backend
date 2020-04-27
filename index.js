const express = require('express')
const mysql = require('mysql')
const app = express()
const PORT = 5000


const db = mysql.createConnection({
    user: "root",
    password : "bwacourse",
    database : "tokokasih",
    host : "localhost",
    port : 3306
})

app.use(express.json())

db.connect()

app.get('/',(req,res)=>{
    res.send('<h1>Hello World</h1>')
})


// Manage Category Page

// get all categories
app.get('/categories',(req,res)=>{
    let sql = `select * from categories;`
    db.query(sql, (err,result)=>{
        if(err) throw err 
        res.json(result)
    })
})


// get all categories with parent category
app.get('/categories-parent',(req,res)=>{
    let sql = `select c.id as id, c.category as category, c2.category as parent from categories c
    left join categories c2 on c.parentId = c2.id;`
    db.query(sql, (err,result)=>{
        if(err) throw err 
        res.json(result)
    })
})


// delete categories by id
app.delete('/category/:id',(req,res)=>{
    const id = req.params.id
    // check ada child atau enggak

    let sql = `select * from categories where parentId = ?;` 
    db.query(sql, id, (err, child)=>{
        if(err) throw err
        if(child.length > 0){
            console.log(child)
            child.forEach((val)=>{
                db.query('update categories set parentId = null where id = ' + val.id,(err,result)=>{
                    if(err) throw err
                })
            })

            db.query('delete from categories where id = ?', id, (err,result)=>{
                if(err) throw err 
                res.json({message : "success"})
            })


        }else{
            db.query('delete from categories where id = ?', id, (err,result)=>{
                if(err) throw err 
                res.json({message : "success"})
            })

        }

       
    })

    
})



// edit categories by id
app.patch('/category/:id',(req,res)=>{
    let sql = `update categories set ? where id = ?;`
    const data =  req.body
    const id = req.params.id
    db.query(sql, [data,id], (err,result)=>{
        if(err) throw err 
        res.json({message : 'Edit data Success'})
    })
})


// add categories 
app.post('/category',(req,res)=>{
    let sql = `insert into categories set ?;`
    const data =  req.body
    if(data.category){
        
        db.query(sql, data, (err,result)=>{
            if(err) throw err 
            res.send('Success')
        })
    }else{
        res.send('data format invalid')
    }  
})

// MAnage Product




app.get('/prodcat',(req,res)=>{
    let sql = `select  pc.id as id, p.nama as nama, category from productcat pc
join products p on pc.productcId = p.id
join categories c on pc.categoryId = c.id;`
    db.query(sql, (err,result)=>{
        if(err) throw err 
        res.json(result)
    })
})




app.listen(PORT, () => console.log('Server Run on Port ' + PORT))