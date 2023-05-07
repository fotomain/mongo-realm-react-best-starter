

//mongo-realm-react-best-starter
// git remote set-url origin https://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@github.com/fotomain/mongo-realm-react-best-starter

import './App.css';

import {useEffect, useState} from "react";
import * as Realm from 'realm-web'
// import Realm from 'realm';

function App() {


  const [main_data, set_main_data]=useState([])

  const getData = async () =>{

    try {

      if(user_logged_in) {

        const tallData = await user_logged_in.functions.read_all_data()
        set_main_data(tallData)
        console.log('=== dataSet',main_data)

      }

      //======== mongodb pass data to function and insert to collection
      //bbooks_db1.cat_content_blocks
    } catch(err) {
      console.error("Failed to log in", err);
    }

  }

  const [user_logged_in, set_user_logged_in] = useState(null);

  useEffect(() => {

    const app = new Realm.App({ id: "bbbooks_app1-drgbf" });
    //
    console.log(22222222222)
    const credentials = Realm.Credentials.anonymous();

    const do_user_logged_in = async () => {
      const tuser = await app.logIn(credentials);
      console.log("=== tuser",tuser)
      set_user_logged_in(tuser)

    }

    const BookSchema = {
      name: 'cat_content_blocks',
      properties: {
        _id: 'objectId',
        content_text: 'string?',
      },
      primaryKey: '_id',
    };

    const configuration = {
      schema: [BookSchema], // add multiple schemas, comma seperated.
      sync: {
        user: app.currentUser, // loggedIn User
        partitionValue: "2F6092d4c594587f582ef165a0", // should be userId(Unique) so it can manage particular user related documents in DB by userId
      }
    }

    do_user_logged_in().then(res=>{
        console.log("=== step do_user_logged_in")
        const realm_handler = Realm.open(configuration);

          const booksList = realm_handler.objects('cat_content_blocks');

            booksList.addListener(() => {
              console.log('=== booksList.addListener')
              set_main_data([...booksList]);
            });

      }
    )

    return () => {

    };
  }, []);


  useEffect(() => {
    console.log('=== main_data changed',main_data)
    return () => {

    };
  }, [main_data]);


  return (
    <div className="App">
      <header className="header">
        <h1>
          Mongo + Realm FUNCTIONS + React
        </h1>
        <p>user {JSON.stringify(user_logged_in)}</p>

        <br/><br/>
        <button onClick={()=> {

          getData()

        }
        }>READ</button>

        <br/><br/>
        <button onClick={()=> {

          if(user_logged_in) {
            const insert1 = user_logged_in.functions.insert1({
              key: Date.now().toString(),
              value: "DATA + " + Date.now().toString(),
              last_updated: Date.now().toString
            }).then(res=>{

              console.log(77777777777777)
              console.log('=== insert1', res)

              // set_main_data(res)

            })
          }


        }
        }>CREATE </button>

        <br/><br/>
        <button style={{disabled:!user_logged_in}} onClick={()=> {

          // https://www.mongodb.com/docs/manual/reference/method/db.collection.remove/
          // DELETE ALL db.bios.remove( { } )
          // DELETE 1 qty>20 db.products.remove( { qty: { $gt: 20 } }, true )


          const delete_all = async (params) =>{
            const res_del = await user_logged_in.functions.delete_all(params)
            console.log('=== res_del',res_del)
          }

          if(main_data){
            for (let i = 0; i <main_data.length ; i++) {
              delete_all({value:main_data[i]._id})
            }
          }

          set_main_data([])

        }
        }>DELETE ALL</button>

        <br/>

        {(main_data.length==0)?'Loading...':main_data.map((data1,key1)=>{
          // return <li key={key1}>{data1.name}</li>
          return <li key={data1._id}>{data1.content_text}</li>
        })}
      </header>
    </div>
  );
}

export default App;
