import { useState } from 'react'

const Header = ({ text }) => <h1>{text}</h1>
  
const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({ stat, text }) => (
  <tr>
    <td>{text}</td>
    <td>{stat}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad, all}) => {
  if (all === 0) {
    return (
      <div>
        <h1>Statistics</h1>
        No Feedback Given
      </div>
    )
  }
  return (
    <div>
      <h1>Statistics</h1>
        <table>
          <StatisticLine text={'Good'} stat={good} />
          <StatisticLine text={'Neutral'} stat={neutral} />
          <StatisticLine text={'Bad'} stat={bad} />
          <StatisticLine text={'All'} stat={all} />
          <StatisticLine text={'Average'} stat={(good - bad) / all} />
          <StatisticLine text={'Positive'} stat={((good / all) * 100).toString() + ' %'} />
        </table>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)

  // console.log('good', good)
  // console.log('neu', neutral)
  // console.log('bad', bad)

  const handleGoodClick = () => {
    setGood(good + 1)
    setAll(all + 1)
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(all + 1)
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(all + 1)
  }

  return (
    <div>
      <Header text={'Give Feedback'} />
      <Button handleClick={handleGoodClick} text='Good' />
      <Button handleClick={handleNeutralClick} text='Neutral' />
      <Button handleClick={handleBadClick} text='Bad' />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
      
      {/* <Header text={'Statistics'} />
      <Stats stat={good} text='Good' />
      <Stats stat={neutral} text='Neutral' />
      <Stats stat={bad} text='Bad' />
      <Stats stat={all} text='all' />
      <Stats stat={(good - bad) / all} text='Average' />
      <Stats stat={((good / all) * 100).toString() + '%'} text='Positive' /> */}

    </div>
  )
}

export default App