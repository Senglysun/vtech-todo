import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Todos from '../components/todos'

const Home: NextPage = () => {
  return (
    <div>
      <Todos/>
    </div>
  )
}

export default Home
