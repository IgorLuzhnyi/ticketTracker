import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  Typography,
  Stack,
  Grid2 as Grid,
  List,
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
            p: 2,
            pt: 3,
            backgroundColor: "secondary.light",
            borderRadius: ".5rem",
            height: "600px",
          }}
        >
          <Box
            sx={{
              height: "90px",
              display: "block",
              position: "relative",
            }}
          >
            {!projectInputIsOpen && (
              <CustomButton
                sx={{
                  width: "250px",
                  p: 1,
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => {
                  setEditedProjectIndex(NaN);
                  setProjectInputIsOpen(true);
                }}
              >
                Create new project
              </CustomButton>
            )}
            <form
              onSubmit={handleSubmit(submitNewProject)}
              noValidate
              autoComplete="off"
              style={{ width: "100%" }}
            >
              <FormControl sx={{ width: "100%" }}>
                {projectInputIsOpen && (
                  <CustomInput
                    autoFocus
                    variant="outlined"
                    id="new-project"
                    // sx={{ maxWidth: "250px" }}
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
                )}
                <Typography variant="subtitle2" color="error">
                  {projectInputIsOpen ? errors.projectName?.message : ""}
                </Typography>
              </FormControl>
              {projectInputIsOpen && (
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", width: "260px" }}
                >
                  <CustomButton
                    type="submit"
                    variant="contained"
                    sx={{ ...confirmButtonStyling, width: "48%" }}
                  >
                    Submit
                  </CustomButton>
                  <CustomButton
                    variant="contained"
                    sx={{ ...declineButtonStyling, width: "48%" }}
                    onClick={() => {
                      reset();
                      setProjectInputIsOpen(false);
                    }}
                  >
                    Cancel
                  </CustomButton>
                </Stack>
              )}
            </form>
          </Box>

          <Box sx={{ mt: 2, color: "secondary.dark" }}>
            <Typography variant="h5">Current projects:</Typography>
            <List sx={{ height: "50vh", overflowY: "auto" }}>
              {projects.length ? (
                projects.map((project, i) => (
                  <Box key={i}>
                    {editedProjectIndex === i ? (
                      <Stack
                        direction="row"
                        sx={{ width: "100%", justifyContent: "space-between" }}
                      >
                        <form
                          onSubmit={handleSubmit(submitEditedProject)}
                          noValidate
                          autoComplete="off"
                          style={{ width: "100%" }}
                        >
                          <FormControl sx={{ mb: 2, width: "100%" }}>
                            {editedProjectIndex >= 0 && (
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
                                sx={{ backgroundColor: "primary.light" }}
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
                            )}
                            <Typography variant="subtitle2" color="error">
                              {editedProjectIndex >= 0
                                ? errors.projectName?.message
                                : ""}
                            </Typography>
                          </FormControl>
                          {editedProjectIndex >= 0 && (
                            <Stack
                              direction="row"
                              sx={{ justifyContent: "space-between" }}
                            >
                              <Button
                                type="submit"
                                variant="contained"
                                sx={{
                                  color: "secondary.main",
                                  backgroundColor: "info.main",
                                  width: "48%",
                                }}
                              >
                                Submit
                              </Button>
                              <Button
                                variant="contained"
                                sx={{
                                  color: "secondary.main",
                                  backgroundColor: "red",
                                  width: "48%",
                                }}
                                onClick={() => {
                                  reset();
                                  setEditedProjectIndex(NaN);
                                }}
                              >
                                Cancel
                              </Button>
                            </Stack>
                          )}
                        </form>
                      </Stack>
                    ) : (
                      <ListItem
                        disablePadding
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
                            backgroundColor: "info.main",
                            pt: 1,
                            pb: 1,
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography>{project.projectName}</Typography>
                          {/* </Link> */}
                          <Stack>
                            <IconButton
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
                                    removeProject(project.projectId);
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
            </List>
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
