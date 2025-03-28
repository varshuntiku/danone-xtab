import { useContext } from "preact/hooks"
import { RootContext } from "../context/rootContext"

export default function MinervaIcon({...props}) {
  const {minervaIcon} = useContext(RootContext);
  return minervaIcon? minervaIcon
  : <svg {...props} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="m21.49,90.92c-2.56.02-5.14.31-7.68-.18-4.41-.84-7.8-4.67-8.2-9.14-.06-.67-.09-1.35-.09-2.03,0-19.81,0-39.61,0-59.42,0-1.09-.13-2.25.2-3.25.46-1.36,1.15-2.7,2.01-3.84,2.02-2.7,4.82-4.09,8.2-4.09,22.59-.02,45.18-.02,67.77,0,3.42,0,6.32,1.22,8.49,3.94,1.5,1.88,2.23,4.03,2.29,6.42.02.86,0,1.71,0,2.57,0,19.38,0,38.76,0,58.14,0,1.74-.24,3.43-1.04,4.98-1.95,3.77-5.02,5.84-9.31,5.94-1.61.04-3.21,0-4.82,0-.31,0-.63-.03-1.07-.05v-1.3c0-17.09,0-34.19,0-51.28,0-.89-.02-1.78-.03-2.68-.04-2.49-1.75-4.17-4.29-4.21-2.21-.03-4.43,0-6.64,0-1.53,0-3.07-.01-4.6,0-2.38.02-3.85,1.21-4.54,3.73-.11.41.1.89.1,1.34,0,11.28,0,22.56,0,33.83,0,6.53,0,13.06,0,19.59v.82c-.88.26-13.14.36-16.43.14-.01-.39-.03-.8-.03-1.21,0-13.74,0-27.48,0-41.22,0-.88-.06-1.77-.17-2.64-.17-1.42-1.76-2.87-3.32-3.08-.18-.02-.36-.04-.53-.04-4,0-7.99-.03-11.99,0-2.2.02-3.91,1.71-4.05,3.91-.02.36-.01.71-.01,1.07,0,13.92,0,27.84,0,41.76,0,.43-.03.85-.05,1.28-.06.06-.12.12-.18.18Z"/>
  </svg>
}