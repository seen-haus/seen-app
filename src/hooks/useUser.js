import { watchEffect, ref } from 'vue';
import { UserService } from "@/services/apiService"
import useWeb3 from "@/connectors/hooks"

const user = ref(null);

export default function useUser() {
    const { account } = useWeb3();

    const loadUser = async () => {
        try {
            const { data } = await UserService.get(account.value);

            setUser(data?.user || { is_not_registered: true })
        } catch (err) {
          return;
        }
    }

    const setUser = (userData) => {
        user.value = userData || null;
    }

    watchEffect(() => {
        if (account.value) {
            loadUser();
        } else {
            setUser(null)
        }
    })

    return {
        user,
        setUser,
    };
}
