import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { Modal, Table, message } from 'antd';
import { getDateFormat } from '../../../utils/helpers';
import { GetAllOrganisationsOfADonar, GetAllOrganisationsOfAHospital } from '../../../apicalls/users';
import InventoryTable from '../../../components/InventoryTable';

function Organisations({ userType }) {
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const { currentUser } = useSelector((state) => state.users);
  const [selectedOrganisation, setSelectedOrganisation] = React.useState(null);
  const [data, setData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (userType === "hospital") {
        response = await GetAllOrganisationsOfAHospital();
      } else {
        response = await GetAllOrganisationsOfADonar();
      }
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };


  const columns = [
    {
      title: "Name",
      dataIndex: "organisationName",
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
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <span
          className="underline text-md cursor-pointer"
          onClick={() => {
            setSelectedOrganisation(record);
            setShowHistoryModal(true);
          }
          }
        > History </span>
      ),
    },

  ];

  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={data} />

      {showHistoryModal && ( 
      <Modal
        title= { `${
          userType === "donar" ? "Donations History" : "Consumptions History"
        } In ${selectedOrganisation.organisationName}`

        }
        centered
        open={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        width={1000}
        onCancel={() => setShowHistoryModal(false)}
      >

        <InventoryTable
          filters={{
            organisation: selectedOrganisation._id,
            [userType]: currentUser._id,
          }}
        />
      </Modal>  
        )}
    </div>
  );
};

export default Organisations;