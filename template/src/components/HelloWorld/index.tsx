import React, { PureComponent } from 'react'
import styles from './styles.scss'

interface Props {
  text: string;
}

export default class HelloWorld extends PureComponent<Props, {}> {
  render() {
    return (
      <div className={styles.box}>
        {this.props.text}
      </div>
    )
  }
}