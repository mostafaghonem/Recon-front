import _ from "lodash";

const PERMISSIONS = {
  ADMIN: "admin",
  BRANCH_HEAD: "branch_head",
  MASTER_HEAD: "master_head",
  RECON_CLEARANCE_CREATOR: "recon_clearance_creator",
  RECON_CLEARANCE_EDITOR: "recon_clearance_editor",
  RECON_INFLUENCES_CREATOR: "recon_influences_creator",
  RECON_INFLUENCES_EDITOR: "recon_influences_editor",
  RECON_PEOPLE_CREATOR: "recon_people_creator",
  RECON_PEOPLE_EDITOR: "recon_people_editor",
  RECON_STAFF_CREATOR: "recon_staff_creator",
  RECON_STAFF_EDITOR: "recon_staff_editor",
  RECON_RECOMMENDATIONS_MANAGER: "recon_recommendations_manager",
  SOLDIER: "soldier"
};
export const authorize = ({ nuxtState, redirect, route }) => {
  let branches, permissions;
  let validPermissions = true;
  let validBranches = true;

  const branchMasterPermission = ["branch_head", "master_head"];

  route.meta.map(meta => {
    branches = meta.branches;
    if (meta.permissions && typeof meta.permissions !== "undefined") {
      permissions = meta.permissions;
    }
    return undefined;
  });

  const userPermissions = nuxtState.permissions;

  const noPermissions = !userPermissions || typeof userPermissions !== "object";

  if (noPermissions) {
    return redirect("/unauthorized");
  }

  if (userPermissions.find(o => o === "admin")) {
    return true;
  }

  const permissionAuthority =
    permissions &&
    permissions.length > 0 &&
    !_.some(userPermissions, o => permissions.includes(o));
  const branchAuthority =
    branches &&
    branches.length > 0 &&
    !_.some([nuxtState.user.branch], o => branches.includes(o));

  const branchMasterPermissionAuthority = !_.some(userPermissions, o =>
    branchMasterPermission.includes(o)
  );

  if (
    branches &&
    branches.length &&
    !branchMasterPermissionAuthority &&
    !branchAuthority
  ) {
    return true;
  }

  if (permissions && permissions.length && permissionAuthority) {
    validPermissions = false;
  }

  if (branches && branches.length && branchAuthority) {
    validBranches = false;
  }

  if (validPermissions && validBranches) {
    return true;
  }

  return redirect("/unauthorized");
};

export const isAuthorized = ({
  userPermissions,
  userBranch,
  followup,
  branches,
  permissions
}) => {
  let validPermissions = true;
  let validBranches = true;
  const branchMasterPermission = [
    PERMISSIONS.BRANCH_HEAD,
    PERMISSIONS.MASTER_HEAD
  ];

  // Show Everything to Admin
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return true;
  }

  // Don't show this for any one in followup branch
  if (followup && userBranch === "followup") {
    return false;
  }

  const permissionAuthority =
    permissions &&
    permissions.length > 0 &&
    !_.some(userPermissions, o => permissions.includes(o));

  const branchAuthority =
    branches &&
    branches.length > 0 &&
    !_.some([userBranch], o => branches.includes(o));

  console.log('branch auth', permissionAuthority, 'permin auth', branchAuthority)
  const branchMasterPermissionAuthority = !_.some(userPermissions, o =>
    branchMasterPermission.includes(o)
  );

  if (
    branches &&
    branches.length &&
    !branchMasterPermissionAuthority &&
    !branchAuthority
  ) {
    return true;
  }

  if (permissions && permissions.length && permissionAuthority) {
    validPermissions = false;
  }

  if (branches && branches.length && branchAuthority) {
    validBranches = false;
  }

  if (validPermissions && validBranches) {
    return true;
  }

  return false;
};
export default function({
  store,
  redirect,
  beforeNuxtRender,
  route,
  nuxtState
}) {
  // Get authorizations for matched routes (with children routes too)

  if (process.server) {
    beforeNuxtRender(({ nuxtState }) => {
      authorize({ nuxtState, redirect, route });
    });
  }

  if (process.client) {
    authorize({ nuxtState, redirect, route });
  }
}
