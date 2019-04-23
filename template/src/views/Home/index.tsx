import React, { PureComponent } from 'react'
import HelloWorld from '@/components/HelloWorld'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { setHelloWorld } from '@/store/actions'
import styles from './styles.scss'

interface Props {
  text: string;
  setText: (str: string) => void;
}

class Home extends PureComponent<Props> {
  render() {
    return (
      <div className={styles.box}>
        <HelloWorld text={this.props.text} />
      </div>
    )
  }
}

function mapStateToProps(props: any, state: any) {
  return {
    text: props.helloworld.text
  }
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    setText: (str: string) => dispatch(setHelloWorld(str))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)