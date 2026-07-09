import { PermissionDataType } from "@/types/dataTypes/permissiondataType";

interface CustomNavBarProps {
  permissions: PermissionDataType[];
}

export default function CustomNavBar(props: CustomNavBarProps) {
  const { permissions } = props;
  return (
    <div className="w-60 h-full bg-black">
      <ul className="flex flex-col gap-2 p-2">
        {permissions.map((permission) => {
          if (permission.permission_code.endsWith(".read")) {
            return (
              <li key={permission.permission_id} className="text-[#C9C8C8]  bg-[#3B3B3B] p-2 rounded-md">
                {permission.permission_title}
              </li>
            );
          }
        })}
      </ul>
    </div>
  );
}
