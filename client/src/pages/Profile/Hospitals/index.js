import React from 'react'
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { Table, message } from 'antd';
import { GetAllHospitalOfAnOrganisation } from '../../../apicalls/users';
import { getDateFormat } from '../../../utils/helpers';


 function Hospitals() {
    const [data,  setData] = React.useState([]);
    const dispatch = useDispatch();
    
    const getData = async () => {
        try {
          dispatch(SetLoading(true));
          const response = await GetAllHospitalOfAnOrganisation();
          dispatch(SetLoading(false));
          if(response.success) {        
            setData(response.data);
          }else{
            throw new Error(response.message);
          }
        } catch (error) {
          message.error(error.message);
          dispatch(SetLoading(false));
        }
      };
      

      const columns = [
        {
            title: "Hospita Name",
            dataIndex: "hospitalName",
        },

        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "CreatedAt",
            dataIndex: "createdAt",
            render: (text) => getDateFormat(text),
        },
        
      ];
  
      React.useEffect(() => {
        getData();
      }, []);
  return  (
  <div>
         <Table columns={columns} dataSource={data} />
  </div>
  );
}
export default Hospitals;

