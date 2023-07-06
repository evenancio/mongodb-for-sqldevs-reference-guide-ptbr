/*
  SEJA BEM-VINDO AO CRASH COURSE: MONGODB FOR SQL DEVELOPERS
*/





// ####################################################
// ########### CAPÍTULO 1: PRIMEIROS PASSOS ###########
// ####################################################





/*
    1. Criar uma nova coleção e inserir documentos

    NoSQL: Collection (MongoDb) = Table (SQL)
           Documents (MongoDb) = Rows (SQL)

           BSON = Binary JSON

    CREATE TABLE people (
        id INT NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(30),
        age NUMBER,
        status CHAR(1),
        PRIMARY KEY (id)
    )

    INSERT INTO people(user_id, age, status) VALUES ('abc123', 55, 'A')

    INSERT INTO people(user_id, age, status) VALUES ('bcd234', 13, 'B')
    INSERT INTO people(user_id, age, status) VALUES ('cde345', 31, 'C')
    INSERT INTO people(user_id, age, status) VALUES ('def456', 23, 'D')
*/

// Inserir um único documento na collection
db.people.insertOne({user_id: 'abc123', age: 55, status: 'A'});

// Inserir em bloco: vários documentos na collection de uma única vez
db.people.insertMany([
    {user_id: 'bcd234', age: 13, status: 'B'},
    {user_id: 'cde345', age: 31, status: 'C'},
    {user_id: 'def456', age: 23, status: 'D'}
]);

// insertOne: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/
// insertMany: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/ 
// bson & json: https://www.mongodb.com/json-and-bson






/*
    2. Como adicionar um novo campo na collection

    ALTER TABLE people
    ADD join_date DATETIME

    UPDATE people SET join_date = GETDATE()

*/

db.people.updateMany(
    {},
    {
        $set: {
            join_date: new Date()
        }
    }
);

// updateOne: https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
// updateMany: https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/ 





/*
    3. Criando indices em nossas collections

    Simple Index
    CREATE INDEX idx_user_id_asc
    ON people(user_id)

    Compound Index
    CREATE INDEX idx_user_id_asc_age_desc
    ON people(user_id, age DESC)

*/

// Indice simples
db.people.createIndex({ user_id: 1})

// Indice composto
db.people.createIndex({ user_id: 1, age: -1})

// createIndex: https://www.mongodb.com/docs/manual/reference/method/db.collection.createIndex/





/*
    4. Deletando documentos das collections
    DELETE FROM people
*/
db.people.deleteOne({})
db.people.deleteMany({})

// deleteOne: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/
// deleteMany: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/





/*
    5. Drop collection
    DROP TABLE people
*/
db.people.drop()

// drop: https://www.mongodb.com/docs/manual/reference/method/db.collection.drop/





// ####################################################
// ################ CAPÍTULO 2: QUERIES ###############
// ####################################################





// SELECT * FROM people
db.people.find()

// SELECT id, user_id, status FROM people
db.people.find({}, {user_id: 1, status: 1})

// SELECT user_id, status FROM people
db.people.find({}, {user_id: 1, status: 1, _id: 0})

// SELECT * FROM people WHERE status = "A"
db.people.find({status: 'A'})

// SELECT user_id, status FROM people WHERE status = "A"
db.people.find({status: 'A'}, {user_id: 1, status: 1, _id: 0})

// find https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
// query https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-query
// projection https://www.mongodb.com/docs/manual/reference/method/db.collection.find/#std-label-method-find-projection





// SELECT * FROM people WHERE status <> "A"
db.people.find({
    status: {$ne: 'A'}
})

// Not Equal - $ne - https://www.mongodb.com/docs/manual/reference/operator/query/ne/





// SELECT * FROM people WHERE status = "A" AND age = 50
db.people.find({
    status: 'A',
    age: 50
})

// SELECT * FROM people WHERE age > 25
db.people.find({
    age: {$gt: 25}
})

// SELECT * FROM people WHERE age <= 31
db.people.find({
    age: {$lte: 31}
})

// SELECT * FROM people WHERE age > 25 AND age <= 50
db.people.find({
    age: { $gt: 25, $lte: 50 }
})

// > - $gt - https://www.mongodb.com/docs/manual/reference/operator/query/gt/
// <= - $lte - https://www.mongodb.com/docs/manual/reference/operator/query/lte/





// SELECT * FROM people WHERE user_id LIKE "%bc%"
db.people.find({
    user_id: /bc/
})

// SELECT * FROM people WHERE user_id LIKE "bc%"
db.people.find({
    user_id: /^bc/
})

// Regular Expression - $regex - https://www.mongodb.com/docs/manual/reference/operator/query/regex/





/*
    SELECT *
    FROM people
    WHERE status = "A"
    ORDER BY user_id ASC
*/
db.people.find({status: 'A'}).sort({user_id: 1})

/*
    SELECT *
    FROM people
    WHERE status <> "A"
    ORDER BY user_id ASC
*/
db.people.find({
    status: {$ne: 'A'}
}).sort({user_id: 1})

db.people.find({
    status: {$ne: 'A'}
}).sort({age: -1})

// sort - https://www.mongodb.com/docs/manual/reference/method/cursor.sort/





/*
    SELECT *
    FROM people
    WHERE status IN ("B","C")
*/
db.people.find({
    status: {$in: ['B', 'C']}
})

/*
    SELECT *
    FROM people
    WHERE status NOT IN ("B","C")
*/
db.people.find({
    status: {$nin: ['B', 'C']}
})

// IN - $in - https://www.mongodb.com/docs/manual/reference/operator/query/in/
// NOT IN - $nin - https://www.mongodb.com/docs/manual/reference/operator/query/nin/





/*
    SELECT *
    FROM people
    WHERE age = 13 OR status = "A"
*/
db.people.find({
    $or: [
        {age: 13},
        {status: 'A'}
    ]
})

// OR - $or - https://www.mongodb.com/docs/manual/reference/operator/query/or/






// SELECT COUNT(*) FROM people
db.people.countDocuments()

// SELECT COUNT(user_id) FROM people
db.people.countDocuments({
    user_id: {$exists: true}
})

// SELECT COUNT(*) FROM people WHERE age > 30
db.people.countDocuments({
    age: {$gt: 30}
})

// SELECT DISTINCT(status) FROM people
db.people.distinct('status')

/*
    SELECT * FROM people OFFSET 10 ROWS FETCH NEXT 5
*/
db.people.find().skip(10).limit(5)

// countDocuments - https://www.mongodb.com/docs/manual/reference/method/db.collection.countDocuments/
// distinct - https://www.mongodb.com/docs/manual/reference/method/db.collection.distinct/
// skip - https://www.mongodb.com/docs/manual/reference/method/cursor.skip/
// limit - https://www.mongodb.com/docs/manual/reference/method/cursor.limit/





// ####################################################
// ################ CAPÍTULO 3: UPDATE ################
// ####################################################

/*
    UPDATE people
    SET status = "C"
    WHERE age > 25
*/
db.people.updateMany(
    { age: {$gt: 25} },
    {
        $set: {
            status: 'C'
        }
    }
)

/*
    UPDATE people
    SET age = age + 3
    WHERE status = "C"
*/

db.people.updateMany(
    {
        status: 'C'
    },
    {
        $inc: { age: 3 }
    }
)
// $inc - https://www.mongodb.com/docs/manual/reference/operator/update/inc/





// ####################################################
// ################ CAPÍTULO 4: DELETE ################
// ####################################################

/*
    DELETE FROM people
    WHERE status = "D"
*/
db.people.deleteOne({ status: 'D'})
db.people.deleteMany({ status: 'D'})

// deleteOne - https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/
// deleteMany - https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/





// ####################################################
// ######## CAPÍTULO 5: AGGREGATION FRAMEWORK #########
// ####################################################

/*
    SELECT TOP 10 age as idade, status, user_id as id
    FROM people
    WHERE status = "A"
    ORDER BY user_id ASC
*/

db.people.aggregate([
    // Estágio 1
    { $match: { status: 'A'} },
    // Estágio 2
    {
        $project: {
            idade: '$age',
            status: 1,
            id: '$user_id',
            _id: 0
        }
    },
    // Estágio 3
    { $sort: { id: 1} },
    // Estágio 4
    { $limit: 10 }
])

// $match - https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/
// $project - https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/
// $sort - https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/
// $limit - https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/





/*
    CREATE VIEW people_view AS
    SELECT TOP 10 age as idade, status, user_id as id
    FROM people
    WHERE status = "A"
    ORDER BY user_id ASC
*/

db.createView('people_view', 'people', [
    // Estágio 1
    { $match: { status: 'A'} },
    // Estágio 2
    {
        $project: {
            idade: '$age',
            status: 1,
            id: '$user_id',
            _id: 0
        }
    },
    // Estágio 3
    { $sort: { id: 1} },
    // Estágio 4
    { $limit: 10 }
])

db.people_view.find()
db.people_view.aggregate([
    {$match: { status: 'A'}}
])

// DROP VIEW
db.people_view.drop()

// createView - https://www.mongodb.com/docs/manual/reference/method/db.createView/





/*
    INSERT INTO people_collection_2
    SELECT age AS idade, status, user_id as id
    FROM people
*/

db.people.aggregate([    
    { $match: { status: 'A'} },    
    {
        $project: {
            idade: '$age',
            status: 1,
            id: '$user_id',
            _id: 0
        }
    },    
    { $sort: { id: 1} },    
    { $limit: 10 },
    { $out: 'people_collection_2'}
])

db.people_collection_2.find()
// $out - https://www.mongodb.com/docs/manual/reference/operator/aggregation/out/





/*
    SELECT * FROM people_view
    UNION ALL
    SELECT * FROM people_collection_2
*/

db.people_view.aggregate([
    {
        $unionWith: {
          coll: 'people_collection_2'          
        }
    }
])
// $unionWith - https://www.mongodb.com/docs/manual/reference/operator/aggregation/unionWith/





db.product.insertMany([
    { name: 'Soap', price: 5, category: 'Hygiene' },
    { name: 'Toothpaste', price: 3.5, category: 'Hygiene' },
    { name: 'Coca Cola', price: 8.75, category: 'Drinks' },
    { name: '7-Up', price: 6, category: 'Drinks' },
    { name: 'Cornflakes', price: 19.9, category: 'Cereals' },
    { name: 'Banana', price: 8.9, category: 'Fruits' },
    { name: 'Apple', price: 12.3, category: 'Fruits' },
    { name: 'Orange', price: 12.5, category: 'Fruits' },
    { name: 'Pear', price: 8.5, category: 'Fruits' },
]);

db.product.find()

// IF-ELSE
// Vamos IF-ELSE para criar um novo campo
// Então vamos usar este novo campo para filtrar resultados

// SELECT *, GETDATE() as date FROM product
db.product.aggregate([
    // Estágio 1
    {
        $addFields: {
          date: new Date(),
          tag: {
            $cond: {
                if: {$gte: ['$price', 10]},
                then: 'Caro',
                else: 'Barato'
            }
          }
        }
    },
    // Estágio 2
    {$match: {tag: 'Caro'}}
]);

db.product.aggregate([
    // Estágio 1
    {
        $set: {
          date: new Date(),
          tag: {
            $cond: {
                if: {$gte: ['$price', 10]},
                then: 'Caro',
                else: 'Barato'
            }
          }
        }
    },
    // Estágio 2
    {$match: {tag: 'Caro'}}
]);

// IF-ELSE Atalho
db.product.aggregate([
    // Estágio 1
    {
        $addFields: {
          date: new Date(),
          tag: {
            $cond: [{$gte: ['$price', 10]}, 'Caro', 'Barato']
          }
        }
    },
    // Estágio 2
    {$match: {tag: 'Caro'}}
]);

// $addFields - https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/
// $cond - https://www.mongodb.com/docs/manual/reference/operator/aggregation/cond/
// $set - https://www.mongodb.com/docs/manual/reference/operator/aggregation/set/





// GROUP BY
/*
   SELECT category, COUNT(1)
   FROM product
   GROUP BY category
*/
db.product.aggregate([
    {
        $group: {
            _id: '$category',
            qty: {$sum: 1}
        }
    }
])

db.product.aggregate([
    {
        $group: {
            _id: '$category',
            qty: {$sum: 1},
            priceTotal: {$sum: '$price'},
            priceAverage: {$avg: '$price'}
        }
    }
])

// $group - https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/
// $sum - https://www.mongodb.com/docs/manual/reference/operator/aggregation/sum/
// $avg - https://www.mongodb.com/docs/manual/reference/operator/aggregation/avg/





// BUCKET
db.product.aggregate([
    {
        $bucket: {
            groupBy: '$price',
            boundaries: [0, 5, 10, 15, 20, 25, 30],
            default: 'Other'
        }
    }
])

// BUCKET
db.product.aggregate([
    {
        $bucket: {
            groupBy: '$price',
            boundaries: [0, 5, 10, 15, 20, 25, 30],
            default: 'Other',
            output: {
                count: {$sum: 1},
                product: { $push: {name: '$name', price: '$price'}}
            }
        }
    },

    { $sort: {count: 1} }
])

db.product.aggregate([
    {
        $bucketAuto: {
          groupBy: '$price',
          buckets: 6,
          output: {
            count: {$sum: 1},
            product: { $push: {name: '$name', price: '$price'}}
          }
        }
    }
])

db.product.aggregate([
    {
        $facet: {
          byCategories: [
            { $group: {_id: '$category', qty: {$sum: 1}}}
          ],
          byPrice: [
            {
                $bucketAuto: {
                    groupBy: '$price',
                    buckets: 6,
                    output: {
                      count: {$sum: 1},
                      product: { $push: {name: '$name', price: '$price'}}
                    }
                }
            }
          ]
        }
    }
])

// $bucket - https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucket/
// $bucketAuto - https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucketAuto/
// $facet - https://www.mongodb.com/docs/manual/reference/operator/aggregation/bucketAuto/





// UNWIND

db.movie.insertMany([
    {title: 'IT', tags: ['Horror']},
    {title: 'Megan', tags: ['Horror', 'SCI-FI', 'Triller']},
    {title: 'Avatar', tags: ['Action', 'Adventure', 'Fantasy']},
    {title: 'Andor', tags: ['Action',  'Adventure', 'Drama']},
    {title: 'Barbie', tags: ['Comedy', 'Adventure', 'Fantasy']}
])

db.movie.find()

db.movie.aggregate([
    {$unwind: '$tags'}
])

db.movie.aggregate([
    {$unwind: '$tags'},
    {$group: {
        _id: '$tags',
        qty: {$sum: 1}
    }},
    {$sort: { qty: -1}},
    {$limit: 3}
])

// $unwind - https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/





// Substring
db.movie.aggregate([
    {$unwind: '$tags'},
    {
        $set: {
            letter: {$substr: ['$title', 0, 1]}
        }
    },
    {
        $group: {
            _id: '$letter',
            movies: {
                $addToSet: { title: '$title'}
            }
        }
    }
])

db.movie.aggregate([
    {$unwind: '$tags'},
    {
        $set: {
            letter: {$substr: ['$title', 0, 1]}
        }
    },
    {
        $group: {
            _id: '$letter',
            movies: {
                 $push: '$$ROOT'
            }
        }
    }
])


//$substr - https://www.mongodb.com/docs/manual/reference/operator/aggregation/substr/
//$addToSet - https://www.mongodb.com/docs/manual/reference/operator/aggregation/addToSet/
//$push - https://www.mongodb.com/docs/manual/reference/operator/aggregation/push/





// MAP
// Transformação de uma coleção para alguma outra coisa
// movie.tags.map(t => t.toUpperCase())

db.movie.aggregate([
    {
        $set: {
            tags: { 
                $map: {
                    input: '$tags',
                    as: 't',
                    in: { $toUpper: '$$t' }
                }
            }
        }
    }
])

// REDUCE
/*
    const tags = [
      "HORROR",
      "SCI-FI",
      "TRILLER"
    ]

    // Resultado esperado após aplicar a função Reduce
    const output = "HORROR,SCI-FI,TRILLER,"

    const output = tags.reduce((v,t) => v + t + ',', '')

    looping 1: '' + HORROR + , = 'HORROR,'
    looping 2: 'HORROR,' + 'SCI-FI' + ',' = 'HORROR,SCI-FI,'
    looping 3: 'HORROR,SCI-FI,' + 'TRILLER' + ',' = 'HORROR,SCI-FI,TRILLER,'

*/

db.movie.aggregate([
    {
        $set: {
            tags: {
                $reduce: {
                    input: '$tags',
                    initialValue: '',
                    in: { $concat: ['$$value', '$$this', ',']}
                }
            }
        }
    }
])

// MAP AND REDUCE
db.movie.aggregate([
    {
        $set: {
            tags: { 
                $map: {
                    input: '$tags',
                    as: 't',
                    in: { $toUpper: '$$t' }
                }
            }
        }
    },
    {
        $set: {
            tags: {
                $reduce: {
                    input: '$tags',
                    initialValue: '',
                    in: { $concat: ['$$value', '$$this', ',']}
                }
            }
        }
    }
])

// $map - https://www.mongodb.com/docs/manual/reference/operator/aggregation/map/
// $toUpper - https://www.mongodb.com/docs/manual/reference/operator/aggregation/toUpper/
// $reduce - https://www.mongodb.com/docs/manual/reference/operator/aggregation/reduce/
// $concat - https://www.mongodb.com/docs/manual/reference/operator/aggregation/concat/





// Sample
// Pega itens de forma aleatória de uma collection
db.movie.aggregate([
    {
        $sample: { size: 2 }
    }
])

// sample - https://www.mongodb.com/docs/manual/reference/operator/aggregation/sample/





// ####################################################
// ################# CAPÍTULO 6: JOIN #################
// ####################################################

/*

   SELECT * 
   FROM checkout
   JOIN product
   ON checkout.productId = product.productId

*/

db.product.drop();

db.product.insertMany([
    { productId: 1, name: 'Soap', price: 5, category: 'Hygiene' },
    { productId: 2, name: 'Toothpaste', price: 3.5, category: 'Hygiene' },
    { productId: 3, name: 'Coca Cola', price: 8.75, category: 'Drinks' },
    { productId: 4, name: '7-Up', price: 6, category: 'Drinks' },
    { productId: 5, name: 'Cornflakes', price: 19.9, category: 'Cereals' },
    { productId: 6, name: 'Banana', price: 8.9, category: 'Fruits' },
    { productId: 7, name: 'Apple', price: 12.3, category: 'Fruits' },
    { productId: 8, name: 'Orange', price: 12.5, category: 'Fruits' },
    { productId: 9, name: 'Pear', price: 8.5, category: 'Fruits' },
]);

db.checkout.insertMany([
    { customer: 'John', productId: 3, qty: 2 },
    { customer: 'Mary', productId: 1, qty: 5 },
    { customer: 'George', productId: 3, qty: 3 },
]);

db.checkout.aggregate([
    {
        $lookup: {
          from: 'product',
          localField: 'productId',
          foreignField: 'productId',
          as: 'products'
        }
    }
]);

db.checkout.aggregate([
    {
        $lookup: {
          from: 'product',
          localField: 'productId',
          foreignField: 'productId',
          as: 'products'
        }
    },

    {
        $set: {
            product: {$first: '$products'}
        }
    },

    {
        $set: {
            productName: '$product.name',
            productPrice: '$product.price'
        }
    },

    {
        $unset: ['product', 'products', '_id']
    },

    {
        $set: {
            totalPrice: {
                $multiply: ['$productPrice', '$qty']
            }
        }
    }
]);

// $lookup - https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/
// $first - https://www.mongodb.com/docs/manual/reference/operator/aggregation/first/
// $unset - https://www.mongodb.com/docs/manual/reference/operator/aggregation/unset/
// $multiply - https://www.mongodb.com/docs/manual/reference/operator/aggregation/multiply/





// Vamos nos aprofundar um pouco mais nestes pipelines

db.checkout.drop()
db.checkout.insertMany([
    {
        customer: 'John',
        basket: [
            {productId: 3, qty: 2},
            {productId: 7, qty: 1},
        ]
    },
    {
        customer: 'Mary',
        basket: [
            {productId: 1, qty: 5},
            {productId: 4, qty: 6},
            {productId: 9, qty: 1},
        ]
    },    
    {
        customer: 'George',
        basket: [
            {productId: 3, qty: 3}
        ]
    }
]);

db.checkout.find()

db.checkout.aggregate([
    { $unwind: '$basket'},

    {
        $lookup: {
            from: 'product',
            localField: 'basket.productId',
            foreignField: 'productId',
            as: 'products'
        }
    },

    {
        $set: {
            product: {$first: '$products'}
        }
    },

    {
        $set: {            
            lines: {
                productName: '$product.name',
                unitPrice: '$product.price',
                qty: '$basket.qty',
                totalPrice: {
                    $multiply: ['$basket.qty', '$product.price']
                }
            }
        }
    },

    {
        $unset: ['product', 'products', '_id']
    },

    {
        $group: {
            _id: '$customer',
            lines: { $addToSet: '$lines'},
            totalPrice: { $sum: '$lines.totalPrice'}
        }
    }
])


// ####################################################
// ################ BÔNUS: GEOSPATIAL #################
// ####################################################

/*
    https://geojson.org
    primeiro é a longitude
    segundo é a latitude

    "location": {
        "type": "Point",
        "coordinates": [125.6, 10.1]
    }

    '2d' - estamos tratando de pontos em linha reta
    '2dsphere' - estamos tratando de pontos em linha curva (como na esféra terrestre)
*/

// Vamos começar criando uma nova coleção 
// chamada 'home' que irá armazenar o endereço de alguns clientes

db.home.insertMany([
    {
        name: 'São Caetano do Sul',
        location: {
            type: 'Point',
            coordinates: [-23.626534508911906, -46.57409199113332]
        }
    },
    {
        name: 'São Bernardo do Campo',
        location: {
            type: 'Point',
            coordinates: [-23.700232873283706, -46.56187305411031]
        }
    },
    {
        name: 'Jundiaí',
        location: {
            type: 'Point',
            coordinates: [-23.1845424599305, -46.888095141868966]
        }
    },
    {
        name: 'Americana',
        location: {
            type: 'Point',
            coordinates: [-22.737024534618737, -47.33335150618665]
        }
    },
    {
        name: 'Itápolis',
        location: {
            type: 'Point',
            coordinates: [-21.595875459149177, -48.81202751618742]
        }
    },
    {
        name: 'Curitiba',
        location: {
            type: 'Point',
            coordinates: [-25.43489061879137, -49.27333180944079]
        }
    },
])

// Criando o indíce do tipo 2dsphere
db.home.createIndex({ location: '2dsphere'})


db.home.find({
    location: {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [-23.626534508911906, -46.57409199113332]
            },
            $maxDistance: 500 * 1000,
            $minDistance: 50 * 1000
        }
    }
})

db.home.aggregate([
    {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [-23.626534508911906, -46.57409199113332]
          },
          distanceField: 'distancia',    
          minDistance: 1,
          query: {
            name: { $nin: ['Americana', 'Jundiaí']}
          }
        }
    }
])

// Geospatial Queries - https://www.mongodb.com/docs/manual/geospatial-queries/
// Find Restaurants Tutorial - https://www.mongodb.com/docs/manual/tutorial/geospatial-tutorial/
// $near - https://www.mongodb.com/docs/manual/reference/operator/query/near/
// $maxDistance - https://www.mongodb.com/docs/manual/reference/operator/query/maxDistance/
// $minDistance - https://www.mongodb.com/docs/manual/reference/operator/query/minDistance/
// $geoNear - https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/





/*

PRÓXIMOS PASSOS

https://www.practical-mongodb-aggregations.com/
https://learn.mongodb.com/

*/