package com.example.HabitService;

import com.example.HabitService.Controller.HabitController;
import com.example.HabitService.Service.HabitService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HabitController.class)
@AutoConfigureMockMvc
class HabitServiceApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private HabitService habitService; // 🔑 VERY IMPORTANT

	@Test
	void contextLoads() {
	}

	@Test
	void getMarketplaceHabits_shouldReturnOk() throws Exception {
		mockMvc.perform(get("/habits/marketplace"))
				.andExpect(status().isOk());
	}
}