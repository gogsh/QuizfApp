
import axios from '../../axios/axios-quiz'
import {
  FINISH_QUIZ,
  QUIZ_SET_STATE,
  FETCH_QUIZES_START,
  FETCH_QUIZES_SUCCESS,
  FETCH_QUIZES_ERROR,
  FETCH_QUIZ_SUCCESS,
  QUIZ_NEXT_QUESTION,
  QUIZ_RETRY
} from './actionTypes'


export function fetchQuizes() {
  return async dispatch => {
    dispatch(fetchQuizesStart())
    try {
      const response = await axios.get('/quizes.json')
      const quizes = []

      Object.keys(response.data).forEach((key, index) => {
        quizes.push({
          id: key,
          name: `test #${index + 1}`
        })
      })

      dispatch(fetchQuizesSuccess(quizes))

    } catch (e) {
      dispatch(fetchQuizesError(e))
    }
  }
}

export function fetchQuizById(quizId) {
  return async dispatch => {
    dispatch(fetchQuizesStart())
    try {
      const response = await axios.get(`/quizes/${quizId}.json`)
      const quiz = response.data
      dispatch(fetchQuizSuccess(quiz))
    } catch (e) {
      dispatch(fetchQuizesError(e))
    }
  }
}

export function fetchQuizSuccess(quiz) {
  return {
    type: FETCH_QUIZ_SUCCESS,
    quiz
  }
}

export function fetchQuizesStart(params) {
  return {
    type: FETCH_QUIZES_START
  }
}


export function fetchQuizesSuccess(quizes) {
  return {
    type: FETCH_QUIZES_SUCCESS,
    quizes
  }
}

export function fetchQuizesError(e) {
  return {
    type: FETCH_QUIZES_ERROR,
    error: e
  }
}

export function finishQuiz() {
  return {
    type: FINISH_QUIZ
  }
}

export function quizSetState(answerState, results) {
  return {
    type: QUIZ_SET_STATE,
    answerState,
    results
  }
}

export function quizNextQuestion(number) {
  return { 
    type: QUIZ_NEXT_QUESTION,
    number
  }
}

export function retryQuiz(params) {
  return {
    type: QUIZ_RETRY
  }
}

export function quizAnswerClick(answerId) {
  return (dispatch, getState) => {
    const state = getState().quiz
    if (state.answerState) {
      const key = Object.keys(state.answerState)[0]
      console.log(key)
      console.log(state.answerState[key])
      if (state.answerState[key] === 'success') {
        return
      }
    }

    const question = state.quiz[state.activeQuestion]
    const results = state.results

    if (question.rightAnswerId === answerId) {

      if (!results[question.id]) {
        results[question.id] = 'success'

      }


      dispatch(quizSetState({ [answerId]: 'success' }, results))
      


      const timeout = window.setTimeout(() => {
        if (isQuizFinished(state)) {
          dispatch(finishQuiz())          
        } else {         
          dispatch(quizNextQuestion(state.activeQuestion + 1))
        }
        window.clearTimeout(timeout)
      }, 1000)
    } else {
      results[question.id] = 'error'  // Записали ошибку в results
      dispatch(quizSetState({ [answerId]: 'error' }, results))
    }
  }
}

function isQuizFinished(state) {
  return state.activeQuestion + 1 === state.quiz.length
}