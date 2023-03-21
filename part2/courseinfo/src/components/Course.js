const Header = ({ name }) => {
    return (
      <h1>{name}</h1>
    )
  }
  
  const Part = ({ part }) => {
    return (
      <p>{part.name} {part.exercises}</p>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part => 
          <Part key={part.id} part={part} />
        )}
      </div>
    )
  }
  
  const Total = ({ parts }) => {
    const total = parts.reduce((acc, obj) => acc + obj.exercises , 0);
    return (
      <b>Total of {total} exercises</b>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  export default Course