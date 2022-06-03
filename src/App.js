

//mongo-realm-react-best-starter

import './App.css';
import {useEffect, useState} from "react";
import * as Realm from 'realm-web'

function App() {

  const [dataSet, setDataSet]=useState([])
  const [dataCount, setCount]=useState(0)

  const getData = async () =>{

    console.log(11111111111)
    // const app = new Realm.App({ id: "realmyt-mkhed" });
    const app = new Realm.App({ id: "bbbooks_app1-drgbf" });
    //
    console.log(22222222222)
    const credentials = Realm.Credentials.anonymous();
    console.log(33333333333)
    try {
      console.log(44444444444444)
      const user = await app.logIn(credentials);
      console.log(5555555555555)
      // const allData = await user.functions.getAllData()
      const allData = await user.functions.getAllDataBlocks()

      //======== mongodb pass data to function and insert to collection
      const insert1 = await user.functions.insert1({key:Date.now().toString(), value:"111", last_updated:Date.now().toString})
      //bbooks_db1.cat_content_blocks
      console.log(77777777777777)
      setDataSet(allData)
      console.log(allData)
    } catch(err) {
      console.error("Failed to log in", err);
    }

  }

  useEffect(() => {
    return () => {
      const callAs = async () =>{
        await getData()
      }
        callAs()
        console.log(111)
    };
  }, [
      dataCount
  ]);

  return (
    <div className="App">
      <header className="header">
        <h1>
          Mongo + Realm + React
        </h1>
        <p>{dataCount}</p>
        <button onClick={()=> {

          // getData()
          setDataSet([])
          setCount(Date.now())

        }
        }>READ</button>

        {(dataSet.length==0)?'Loading...':dataSet.map((data1,key1)=>{
          // return <li key={key1}>{data1.name}</li>
          return <li key={data1._id}>{data1.content_text}</li>
        })}
      </header>
    </div>
  );
}

export default App;
