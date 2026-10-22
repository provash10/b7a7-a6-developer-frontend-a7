// {
//     title: "Management",
//     items: [
//         {
//             title: "Overview",
//             url: `${prefix}`,
//         },
//         {
//             title: "Doctor Approval",
//             url: `${prefix}/approve-doctor`,
//         },
//     ],
// },

export interface SidebarItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface SidebarGroup {
  title: string;
  items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];
