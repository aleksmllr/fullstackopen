import PropTypes from 'prop-types'
const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const notificationStyle = {
    color: notification.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={notificationStyle}>{notification.message}</div>
}

Notification.propTypes = {
  notification: PropTypes.object,
}

export default Notification
