import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../redux/loadersSlice';
import { GetAllBloodGroupsInInventory } from '../../apicalls/dashboard';
import { getLoggedInUserName } from '../../utils/helpers';
import InventoryTable from '../../components/InventoryTable';


function Home() {
  const { currentUser } = useSelector((state) => state.users);
  const [bloodGroupsData = [], setBloodGroupsData] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
        dispatch(SetLoading(true));
        const response = await GetAllBloodGroupsInInventory();
        dispatch(SetLoading(false));
        if(response.success)
        {
          setBloodGroupsData(response.data);
        }else{
          throw new Error(response.message);
        }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const colours = [
    "#52006A" , "#116D6E" , "#E55807" , "#47A992", "#9376E0" , "#DB005B" , "#30A2FF" , "#DD58D6"
  ]
  return (
    <div>

    {currentUser.userType === "organisation" && (
       <>
       <div className="grid grid-cols-4 gap-5 mb-5 mt-2">
            {bloodGroupsData.map((bloodGroup, index) =>{
              const color = colours[index];
              return <div
               className={`p-5 flex justify-between text-white rounded items-center`}
               style={{ backgroundColor: color}}
              >
  
               <h1
                className="text-4xl uppercase">
                  {bloodGroup.bloodGroup}
               </h1>
  
                <div className="flex flex-col justify-between gap-2">
                      <div className="flex justify-between gap-5">
                        <spna>Total In </spna>
                        <spna>{bloodGroup.totalIn} ML</spna>
                        </div>
  
                        <div className="flex justify-between gap-5">
                        <spna>Total Out  </spna>
                        <spna>{bloodGroup.totalOut} ML </spna>
                          </div>
  
                          <div className="flex justify-between gap-5">
                        <spna> Available </spna>
                        <spna>{bloodGroup.available} ML </spna>
                          </div>
  
                  </div>
                </div>
  
            })}
        </div>
   
        <span className="text-xl text-gray-700 font-semibold">
          Your Recent Inventory
        </span>
        <InventoryTable 
         
         filters = {{
             organisation: currentUser._id,
  
         }}
         limit={5}
         userType={currentUser.userType} />
       
       </>
    )}


    {currentUser.userType === "donar" && (
      <div>
       <span className="text-xl text-gray-700 font-semibold">
          Your Recent Donations
        </span>
        <InventoryTable 
         
         filters = {{
             donar: currentUser._id,
  
         }}
         limit={5}
         userType={currentUser.userType} />
      
      </div>
    )}

      {currentUser.userType === "hospital" && (
      <div>
       <span className="text-xl text-gray-700 font-semibold">
          Your Recent Requests / Consumptions
        </span>
        <InventoryTable 
         
         filters = {{
             hospital: currentUser._id,
  
         }}
         limit={5}
         userType={currentUser.userType} />
      
      </div>
    )}

    </div>
  );
}

export default Home