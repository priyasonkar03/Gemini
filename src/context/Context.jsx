import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) =>{

    //states variables
    const [input,setInput]= useState("");
    const [recentPrompt, setRecentPrompt]= useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState();

    //for paraghraph
    const delayPara = (index, nextWord)=>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord);
        }, 75*index)
    }

    //for new chat option
    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async(prompt)=>{

        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response;
        if(prompt !== undefined){
            response = await run(prompt);
           setRecentPrompt(prompt) 
        }else{
            setPrevPrompts(prev=>[...prev,input]) 
            setRecentPrompt(input) 
            response =  await run(input)
        }
        // setRecentPrompt(input)
        // setPrevPrompts(prev=>[...prev,input])
        // const response =  await run(input)
        //for remove the **
        let responseArray = response.split("**");
        let newResponse="";
        for(let i=0; i<responseArray.length; i++){
            if(i === 0 || i % 2 !== 1){
                newResponse += responseArray[i];
            }
            else{
                newResponse += "<b>"+responseArray[i]+"</b>"
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0; i<newResponseArray.length; i++){
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ");  //called this functions
        }
        setLoading(false)
        setInput("")
    }

    // onSent("what is react js") this output on console 
    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    return(
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider