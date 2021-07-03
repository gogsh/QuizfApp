import React, {  } from 'react'
import classes from './Input.module.scss'

function isInvalid({valid, touched, shouldValidate}) { 
  // console.log('valid '+valid,'    touched '+ touched, '    shouldValidate ' + shouldValidate) // debug
  return !valid && shouldValidate && touched  
}


function Input(props) {
  const inputType = props.type || 'text'
  const cls = [classes.Input]
  const htmlFor = `${inputType}-${Math.random()}`
  

  if(isInvalid(props)){
    cls.push(classes.invalid)
  }
  return (
    <div className={cls.join(' ')}>
      <label htmlFor={htmlFor}>{props.label}</label>
      <input 
      type= {inputType}
      id={htmlFor}
      value={props.value}
      onChange={props.onChange}
      />

      {
      isInvalid(props) 
      ? <span>{props.errorMessage || 'введите верное значение'}</span>
      : null
      }

      
    </div>
  )
}

export default Input