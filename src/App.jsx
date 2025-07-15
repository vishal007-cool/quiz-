import { useState } from 'react'
import React from 'react'


function App() {

  const [input,setInput]=useState('');

  const handleClick = (value) => {
    if(value==='C'){
      setInput('');

    } else if (value ==='='){
      try{
        setInput(eval(input).toString());
      } catch{
        setInput('Error');
      }
    } else {
      setInput(input + value);

    }

  };

  const buttons = [

     "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "C", "+",
    "=",




  ]



  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      justifyContent:'center',
      alignItems:'center',
      display: "flex",
    }}> 

      <div style={{
        background:'#fff',
        borderRadius:18,
        padding:20,
        width:340,
        textAlign:'center'
      }}>

     <h1 style={{
       color:'#764ba2',
       fontSize:"2.5rem",
       marginBottom:20,
       letterSpacing:2


     }}> calculator

     </h1>

     <input type="text" style={{
      width:'100%',
      fontSize:30,
      color:'#333',
      marginBottom:20,
      padding:12,
      textAlign:'right',
      //background:'#f0f0f0',
      borderRadius:8,
      border:'1px soild #ccc',
      background:'#f7f7fa',

     }} 
     value={input}
     readOnly
     />

     <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap:14,

     }}>
      {
        buttons.map((btn, idx) => (
          <button key={idx}
          onClick={() => handleClick(btn)}
          style={{
            fontSize:22,
            padding:12,
            borderRadius:8,
            border:"none",
             background: btn === "=" ? "#764ba2" : btn === "C" ? "#ff4d4d" : "#e0e7ff",
                color: btn === "=" ? "#fff" : btn === "C" ? "#fff" : "#333",
                fontWeight: btn === "=" ? "bold" : "normal",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.1s",
                boxShadow: "0 2px 6px #0001",
             


          }}
           onMouseOver={e => e.currentTarget.style.background = btn === "=" ? "#5a357a" : btn === "C" ? "#d32f2f" : "#c7d2fe"}
           onMouseOut={e => e.currentTarget.style.background = btn === "=" ? "#764ba2" : btn === "C" ? "#ff4d4d" : "#e0e7ff"}
            

          >

            {btn}
          </button>
      ))}

      <button>

      </button>

     </div>
      </div>

    </div>
  )
}

export default App