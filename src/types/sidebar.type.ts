// {
//     title: "management",
//     items: [
//         {
//             title: "overview",
//             url: `${prefix}`,
//         },
//         {
//             title: "doctor approval",
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
