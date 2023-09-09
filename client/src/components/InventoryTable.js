import React from 'react'
import { GetInventoryWithFilters } from '../apicalls/inventory';
import { useDispatch } from 'react-redux';
import { getDateFormat } from '../utils/helpers';
import { SetLoading } from '../redux/loadersSlice';
import { Table, message } from 'antd';

 function InventoryTable({filters , userType , limit}) {
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const columns = [
      {
        title: "Inventory Type",
        dataIndex: "inventoryType",
       render : (text) => text.toUpperCase()
      },
      {
        title: "Blood Group",
        dataIndex: "bloodGroup",
        render : (text) => text.toUpperCase()
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        render : (text) => text + "ML"
      },
      {
        title: "Reference",
        dataIndex: "reference",
        render : (text, record) => {
          if(userType === "organisation"){
            return record.inventoryType === "in" ? record.donar?.name : record.hospital?.hospitalName;
          }else{
            return record.organisation.organisationName;
          }
        }
      },
      {
        title: "Data",
        dataIndex: "createdAt",
        render : (text) => getDateFormat(text)
      },
    ];

    // Change columns for Hospital Or Donar --

    if(userType !== "organisation"){

      // Remove Inventory Type Column
      columns.splice(0,1);

      // Change Reference column to organisation name--
      columns[2].title = "Organisation Name";

      // Date column should be renamed as taken Date--
      columns[3].title = userType === "hospital" ? "Taken Date" : "Donated Date";
    }


    const getData = async () => {
      try {
        dispatch(SetLoading(true));
        const response = await GetInventoryWithFilters(filters, limit);
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
    }

    React.useEffect(() => {
      getData();
    }, [])

  return (
    <div>
         <Table columns={columns} dataSource={data} 
         className="mt-3"
        />
    </div>
  );
}

export default InventoryTable;