
import {SideNav} from "./component/SideNav"
import {Header} from "./component/Header"
// import useStore from '@/store/nav-store';

export default function Home() {


  
  return (
    <main className="flex">

      <SideNav/>
      <div className="flex-auto">
        <h1>
          {/* <Header/> */}
     
        </h1>
      </div>
      
    </main>
  );
}
