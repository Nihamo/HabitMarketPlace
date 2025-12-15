package com.example.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserServiceApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void contextLoads() {
		// checks if Spring context loads
	}

	@Test
	void getUserProfile_shouldReturnOk() throws Exception {
		mockMvc.perform(get("/users/1"))
				.andExpect(status().isOk());
	}

	@Test
	void getLeaderboard_shouldReturnOk() throws Exception {
		mockMvc.perform(get("/users/leaderboard"))
				.andExpect(status().isOk());
	}
}