import { useNavigate } from "react-router-dom"


export default function Home() {
    const navigate = useNavigate();
  return (
    <div >
      <button onClick={ ()=>{
        navigate('/play');
      } } className="text-white" >Play Online</button>
    </div>
  )
}
