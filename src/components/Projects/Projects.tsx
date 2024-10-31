import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  FormControl,
  Typography,
  Stack,
  Grid2 as Grid,
  ListItem,
  ListItemButton,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CustomInput from "../CustomInput/CustomInput";
import {
  CustomButton,
  confirmButtonStyling,
  declineButtonStyling,
} from "../CustomButtons/CustomButton";
import CustomList from "../CustomList/CustomList";
import { defaultConfirmationWindowValues } from "../ConfirmationWindow/ConfirmationWindow";
import { useProjectsContext } from "../../contexts/projectsContext";
import { useState, useEffect, MouseEvent } from "react";
import { useForm } from "react-hook-form";

type ProjectValues = {
  projectName: string;
};

export function Projects() {
  const {
    projects,
    addProject,
    editProject,
    removeProject,
    selectedProjectIndex,
    setSelectedProjectIndex,
    setConfirmationWindowValues,
  } = useProjectsContext();

  const [projectInputIsOpen, setProjectInputIsOpen] = useState<boolean>(false);
  const [editedProjectIndex, setEditedProjectIndex] = useState<number>(NaN);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuProjectIndex, setMenuProjectIndex] = useState<number | null>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const submitNewProject = (data: ProjectValues) => {
    addProject(data.projectName);
  };

  const submitEditedProject = (data: ProjectValues) => {
    editProject(data.projectName, editedProjectIndex);
  };

  const handleClick = (event: MouseEvent<HTMLElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setMenuProjectIndex(index);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuProjectIndex(null);
  };

  const projectForm = useForm<ProjectValues>({});
  const { register, handleSubmit, reset, formState } = projectForm;
  const { isSubmitSuccessful, errors } = formState;

  useEffect(() => {
    reset();
  }, [editedProjectIndex]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setProjectInputIsOpen(false);
      setEditedProjectIndex(NaN);
    }
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    setProjectInputIsOpen(false);
  }, [selectedProjectIndex]);

  return (
    <Grid container spacing={1}>
      <Grid size={2.5}>
        <Box
          sx={{
            ml: 2,
            mr: 2,
            p: 1.5,
            pt: 3,
            backgroundColor: "info.main",
            borderRadius: ".5rem",
            height: "650px",
          }}
        >
          <Box
            sx={{
              minHeight: "90px",
              display: "block",
              position: "relative",
            }}
          >
            {projectInputIsOpen ? (
              <form
                onSubmit={handleSubmit(submitNewProject)}
                noValidate
                autoComplete="off"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FormControl sx={{ width: "95%" }}>
                  <CustomInput
                    autoFocus
                    variant="outlined"
                    id="new-project"
                    label="Name of the project"
                    {...register("projectName", {
                      required: {
                        value: true,
                        message: "Project name is required",
                      },
                      pattern: {
                        value: /^.{1,20}$/,
                        message: "20 characters max",
                      },
                    })}
                    error={!!errors.projectName}
                  />
                  <Typography variant="subtitle2" color="error">
                    {errors.projectName?.message}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: "space-between",
                      gap: "10px",
                      width: "100%",
                    }}
                  >
                    <CustomButton
                      type="submit"
                      variant="contained"
                      sx={{ ...confirmButtonStyling, flexGrow: 1 }}
                    >
                      Submit
                    </CustomButton>
                    <CustomButton
                      variant="contained"
                      sx={{ ...declineButtonStyling, flexGrow: 1 }}
                      onClick={() => {
                        reset();
                        setProjectInputIsOpen(false);
                      }}
                    >
                      Cancel
                    </CustomButton>
                  </Stack>
                </FormControl>
              </form>
            ) : (
              <CustomButton
                sx={{
                  width: "250px",
                  p: 1,
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "primary.main",
                  color: "#fff",
                }}
                onClick={() => {
                  setEditedProjectIndex(NaN);
                  setProjectInputIsOpen(true);
                }}
              >
                Create new project
              </CustomButton>
            )}
          </Box>

          <Box sx={{ mt: 1, color: "secondary.dark" }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                textAlign: "center",
                fontWeight: "bold",
                color: "secondary.dark",
              }}
            >
              Current projects
            </Typography>
            <CustomList
              sx={{
                height: "50vh",
              }}
            >
              {projects.length ? (
                projects.map((project, i) => (
                  <Box key={i}>
                    {editedProjectIndex === i ? (
                      <Box
                        sx={{
                          width: "100%",
                          mt: 2,
                          mb: 1,
                          justifyContent: "center",
                        }}
                      >
                        <form
                          onSubmit={handleSubmit(submitEditedProject)}
                          noValidate
                          autoComplete="off"
                          style={{ width: "95%" }}
                        >
                          <FormControl sx={{ width: "100%" }}>
                            <CustomInput
                              autoFocus
                              variant="outlined"
                              label="Name of the project"
                              id="existing-project"
                              defaultValue={
                                editedProjectIndex >= 0
                                  ? projects[editedProjectIndex]?.projectName
                                  : ""
                              }
                              {...register("projectName", {
                                required: {
                                  value: true,
                                  message: "Project name is required",
                                },
                                pattern: {
                                  value: /^.{1,20}$/,
                                  message: "20 characters max",
                                },
                              })}
                              error={!!errors.projectName}
                            />
                            <Typography variant="subtitle2" color="error">
                              {errors.projectName?.message}
                            </Typography>
                            <Stack
                              direction="row"
                              sx={{ justifyContent: "space-between" }}
                            >
                              <CustomButton
                                type="submit"
                                variant="contained"
                                sx={{
                                  ...confirmButtonStyling,
                                  width: "48%",
                                }}
                              >
                                Submit
                              </CustomButton>
                              <CustomButton
                                variant="contained"
                                sx={{
                                  ...declineButtonStyling,
                                  width: "48%",
                                }}
                                onClick={() => {
                                  reset();
                                  setEditedProjectIndex(NaN);
                                }}
                              >
                                Cancel
                              </CustomButton>
                            </Stack>
                          </FormControl>
                        </form>
                      </Box>
                    ) : (
                      <ListItem
                        disablePadding
                        className="project-list-item"
                        sx={{
                          mt: i === 0 ? 0 : 1,
                          mb: i === projects.length - 1 ? 0 : 1,
                        }}
                        onClick={() => {
                          setEditedProjectIndex(NaN);
                          setSelectedProjectIndex(i);
                          navigate(`/projects/${project.projectId}/tickets`);
                        }}
                      >
                        <ListItemButton
                          selected={selectedProjectIndex === i}
                          sx={{
                            "&.Mui-selected": {
                              backgroundColor: "primary.main",
                              "&:hover": {
                                backgroundColor: "primary.main",
                              },
                            },
                            "&:hover": {
                              backgroundColor: "secondary.light",
                            },
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography sx={{ pl: 1 }}>
                            {project.projectName}
                          </Typography>
                          <Stack>
                            <IconButton
                              className="project-list-item__edit-icon"
                              size="small"
                              onClick={(event) => {
                                handleClick(event, i);
                                event.stopPropagation();
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            {menuProjectIndex === i && (
                              <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <MenuItem
                                  selected={false}
                                  onClick={(event) => {
                                    handleClose();
                                    event.stopPropagation();
                                    setProjectInputIsOpen(false);
                                    setEditedProjectIndex(i);
                                  }}
                                >
                                  <Typography>Edit</Typography>
                                </MenuItem>
                                <MenuItem
                                  selected={false}
                                  onClick={(event) => {
                                    handleClose();
                                    event.stopPropagation();
                                    setEditedProjectIndex(NaN);
                                    setConfirmationWindowValues({
                                      isOpen: true,
                                      message: `Are you sure you want to delete project ${project.projectName}?`,
                                      onConfirm: () =>
                                        removeProject(project.projectId),
                                      onDecline: () =>
                                        setConfirmationWindowValues(
                                          defaultConfirmationWindowValues
                                        ),
                                    });
                                  }}
                                >
                                  <Typography>Delete</Typography>
                                </MenuItem>
                              </Menu>
                            )}
                          </Stack>
                        </ListItemButton>
                      </ListItem>
                    )}
                    {i === projects.length - 1 ? null : (
                      <Divider
                        sx={{
                          backgroundColor: "secondary.dark",
                          opacity: ".2",
                          ml: 2,
                          mr: 2,
                        }}
                      />
                    )}
                  </Box>
                ))
              ) : (
                <Typography>No projects yet...</Typography>
              )}
            </CustomList>
          </Box>
        </Box>
      </Grid>
      <Grid size={9.5}>
        <Box
          sx={{
            ml: 2,
            mr: 2,
            p: 2,
            borderRadius: ".5rem",
            backgroundColor: "secondary.light",
          }}
        >
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}
