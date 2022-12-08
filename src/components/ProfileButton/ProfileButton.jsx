import React, {useEffect, useRef, useState} from 'react'

const ProfileButton = () => {

    const [open, setOpen] = useState(false);
    let menuRef = useRef();

    useEffect(() => {
        let handler = (e)=>{
          if(!menuRef.current.contains(e.target)){
            setOpen(false);
            console.log(menuRef.current);
          }      
        };
    
        document.addEventListener("mousedown", handler);
        
    
        return() =>{
          document.removeEventListener("mousedown", handler);
        }
    
      });

      const handleLogOut = () => {
        localStorage.removeItem('token');
        document.location.reload(true);
        document.location='/'
      }
    

  return (
    <div>
         <div className='menu-container' ref={menuRef}>
            <div className='menu-trigger mr-4 sm:mr-0' onClick={()=>{setOpen(!open)}}>
                <img
                    className='' 
                    src='https://cdn.pixabay.com/photo/2015/01/08/18/29/entrepreneur-593358_960_720.jpg'></img>
                {/* <p >presiona</p> */}
            </div>

            <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
            <h3>The Kiet<br/><span>Website Designer</span></h3>
            <ul>
                <li className = 'dropdownItem'>
                    <a>My profile</a>
                </li>
                <li className = 'dropdownItem'>
                    <a>Edit Profile</a>
                </li>
                <li className = 'dropdownItem'>
                    <a>Settings</a>
                </li>
                <li className = 'dropdownItem'>
                    <a>help</a>
                </li>
                <li className = 'dropdownItem'>
                    <button 
                        type="button" 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={() => handleLogOut()}
                    >Logout</button>
                </li>
            </ul>
            </div>
        </div>
    </div>
  )
}

function DropdownItem(props){
    return(
      <li className = 'dropdownItem'>
        {/* <img src={props.img}></img> */}
        <a> {props.text} </a>
      </li>
    );
  }

export default ProfileButton